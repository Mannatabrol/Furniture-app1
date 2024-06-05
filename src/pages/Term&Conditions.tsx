import ServicesSection from '../components/ServicesSection';
import { Link } from 'react-router-dom';
import AccordionItem from "../components/accordion/accordion-item";
import Breadcrumb from '../components/Breadcrumb';
import React from 'react';

const termandcondition_data: {
    id: string;
    title: string;
    desc: string;
    isShow?: boolean;
    parent: string;
  }[] = [
    {
      id: "One",
      title: "User Responsibilities",
      desc: "By accessing or using Wood Eco, you agree to comply with these terms and conditions. If you do not agree with any part of these terms, you may not access the website.",
      isShow: true,
      parent: "accordionTwo",
    },
    {
      id: "Two",
      title: "Disclaimer of Warranties",
      desc: "Wood Eco provides the website on an 'as is' and 'as available' basis, without any warranties of any kind, express or implied. Wood Eco does not guarantee the accuracy, reliability, or completeness of any information on the website, and users use the website at their own risk.",
      parent: "accordionTwo",
    },
    {
      id: "Three",
      title: "User Conduct",
      desc: "Users agree not to engage in any unlawful or prohibited activities while using Wood Eco. This includes but is not limited to harassing or impersonating other users, transmitting any harmful or malicious content, or violating any applicable laws or regulations.",
      parent: "accordionTwo",
    },
    {
      id: "Four",
      title: "Third-Party Links",
      desc: "Wood Eco may contain links to third-party websites or services that are not owned or controlled by Wood Eco. Wood Eco is not responsible for the content, privacy policies, or practices of any third-party websites or services. Users access third-party websites at their own risk.",
      parent: "accordionTwo",
    },
    {
      id: "Five",
      title: "Termination of Access",
      desc: "Wood Eco reserves the right to suspend or terminate access to the website, without prior notice or liability, for any reason, including but not limited to a breach of these terms and conditions or fraudulent or illegal activity.",
      parent: "accordionTwo",
    },
    ];
  
  export function TandCItems() {
    return (
      <div className="accordion accordion-style-two" id="accordionTwo">
        {termandcondition_data.map((f) => (
          <AccordionItem
            key={f.id}
            id={f.id}
            isShow={f.isShow}
            title={f.title}
            desc={f.desc}
            parent={f.parent}
          />
        ))}
      </div>
    )
  }
const TermAndConditions = () => {
  return (
    <>
    <Breadcrumb />
    
    <section className="faq-section position-relative mt-180 xl-mt-150 lg-mt-100 mb-150 lg-mb-100">
        <div className="container">
          <div className="title-one text-center">
            {/* <h2 className="text-dark wow fadeInUp" data-wow-delay="0.3s">Questions & Answers</h2> */}
          </div>
          <div className="bg-wrapper mt-60 lg-mt-40">
            <TandCItems />
          </div>
          <div className="text-center mt-50 sm-mt-40 wow fadeInUp">
          <div className="text-center border-bottom pb-150 lg-pb-50 mt-60 lg-mt-40 wow fadeInUp">
          <div className="title-three mb-30">
            <h2 className="fw-normal">Don’t get your answer?</h2>
          </div>
          <Link to='/contact' className="btn-one">Contact Us</Link>
        </div>
          </div>
        </div>
      </section>

    <ServicesSection />
    </>
  );
}

export default TermAndConditions;
