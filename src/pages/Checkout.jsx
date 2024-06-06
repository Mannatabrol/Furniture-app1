import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { generateUUID, currentDate } from '../utils/helpers';
import axios from 'axios';
import styled from 'styled-components';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '../components/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { userID, isAuthenticated } = useContext(AuthContext);
  const [orderID, setOrderID] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('amana');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart]);

  const createOrder = async (values) => {
    try {
      const orderId = generateUUID();
      const deliveryOption = deliveryOptions[selectedDeliveryOption];

      const order = {
        id: orderId,
        user_id: userID,
        shipping_address: values.shippingAddress,
        name: values.name,
        phone: values.phone,
        order_status: 'pending',
        created_at: currentDate(),
        description: `order n° ${orderId}`,
        order_total: totalOrder,
        delivery_company: selectedDeliveryOption === 'amana' ? 'Amana' : 'Ozone',
        delivery_cost: deliveryOption.cost,
        items: cart.items.map((item) => ({
          id: item.id,
          image: item.image,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          quantity_stock: item.quantity_stock,
          subTotal: item.price * item.quantity,
        })),
      };

      const response = await axios.post('http://localhost:3001/orders', order);
      return response.data.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateProductStock = async () => {
    try {
      for (const item of cart.items) {
        const updatedStock = parseInt(item.quantity_stock) - parseInt(item.quantity);
        await axios.patch(`http://localhost:3001/products/${item.id}`, { quantity_stock: updatedStock });
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  };

  const handleOrderPlace = async (values) => {
    try {
      const orderId = await createOrder(values);
      await updateProductStock();
      clearCart();
      setOrderID(orderId);
      setSuccess(true);

      Swal.fire({
        icon: 'success',
        title: 'Order placed successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
    shippingAddress: Yup.string().required('Shipping address is required'),
  });

  const handleOrderDelivered = async () => {
    try {
      await axios.patch(`http://localhost:3001/orders/${orderID}`, { order_status: 'delivered' });
      Swal.fire({
        icon: 'success',
        title: 'Order marked as delivered!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/products');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deliveryOptions = {
    amana: { label: 'Delivery by Amana 24h', cost: 30.0 },
    ozone: { label: 'Delivery by Ozone 48h', cost: 20.0 },
  };

  const subTotal = cart.items.reduce((total, item) => total + item.subTotal, 0);
  const totalOrder = subTotal + deliveryOptions[selectedDeliveryOption].cost;

  const showRazorpay = async (values) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch("http://localhost:1337/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Amount: totalOrder * 100,
        Name: values.name
      })
    }).then((t) => t.json());

    const options = {
      key: "rzp_test_MRvRAK22kZpeog",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: values.name,
      description: "Thank you for nothing. Please give us some money",
      image: "http://localhost:1337/logo.svg",
      handler: function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Transaction successful!',
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            clearCart();
            navigate('/cart');
          }
        });
      },
      prefill: {
        name: values.name,
        email: userID,
        phone_number: values.phone,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className='container px-4'>
      <Breadcrumb />
      <Title>Checkout</Title>
      <div className="row">
        <div className="col-md-6 mt-5">
          <Formik
            initialValues={{
              name: '',
              phone: '',
              shippingAddress: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleOrderPlace(values);
              await showRazorpay(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className='mt-5' onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name:</label>
                  <Field type="text" className="form-control" id="name" name="name" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>
  
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number :</label>
                  <Field type="text" className="form-control" id="phone" name="phone" />
                  <ErrorMessage name="phone" component="div" className="text-danger" />
                </div>
  
                <div className="mb-3">
                  <label htmlFor="shippingAddress" className="form-label">Shipping Address :</label>
                  <Field type="text" className="form-control" id="shippingAddress" name="shippingAddress" />
                  <ErrorMessage name="shippingAddress" component="div" className="text-danger" />
                </div>

                <div className="card-footer text-center">
                  {success ? (
                    <Button handleClick={handleOrderDelivered}>I received my order</Button>
                  ) : (
                    <Button type="submit" className="my-3 px-4" disabled={isSubmitting || !isValid}>
                      Place Order
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Your Order</h2>
              <div className="d-flex justify-content-between">
                <p className="card-text fw-bold">Product</p>
                <span className='fw-bold'>Sub-Total</span>
              </div>
              <hr />
              {cart.items.map((item) => (
                <div key={item.title} className="d-flex justify-content-between mb-2">
                  <p className="card-text">{item.title} <small>({item.quantity})</small></p>
                  <span>{item.subTotal.toFixed(2)} ₹</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <p className="card-text fw-bold">Order Sub-Total : </p>
                <span className='text-success'>{subTotal.toFixed(2)} ₹</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <p className="card-text fw-bold">Order Total : </p>
                <span className='text-danger'>{totalOrder.toFixed(2)} ₹</span>
              </div>
              <p className="card-text">Delivered By : {selectedDeliveryOption === 'amana' ? 'Amana' : 'Ozone'}</p>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="deliveryAmana"
                  value="amana"
                  checked={selectedDeliveryOption === 'amana'}
                  onChange={() => setSelectedDeliveryOption('amana')}
                />
                <label className="form-check-label" htmlFor="deliveryAmana">Delivery by Amana 24h: 30.00 ₹</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="deliveryOzone"
                  value="ozone"
                  checked={selectedDeliveryOption === 'ozone'}
                  onChange={() => setSelectedDeliveryOption('ozone')}
                />
                <label className="form-check-label" htmlFor="deliveryOzone">Delivery by Ozone 48h: 20.00 ₹</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

