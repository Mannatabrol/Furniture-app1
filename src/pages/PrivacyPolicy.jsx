import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import ServicesSection from '../components/ServicesSection';
import { Link } from 'react-router-dom';
import AccordionItem from "../components/accordion/accordion-item";
import { TandCItems } from './Term&Conditions';

const privacy_data =   [
      {
        id: "One",
        title: "Information Collection",
        desc: "Wood Eco collects personal information provided voluntarily by users during the registration process or when creating a profile, such as name, email address, contact information, resume, and job preferences. Additionally, Wood Eco may collect non-personal information automatically, including IP addresses, browser types, and operating systems, to enhance user experience and analyze trends.",
        isShow: true,
        parent: "accordionTwo",
      },
      {
        id: "Two",
        title: "Use of Information",
        desc: "Personal information collected by Wood Eco is used to create and manage user accounts, facilitate job searches and applications, communicate with users about job opportunities and website updates, and personalize user experience. Non-personal information may be used for website analytics and improvement purposes.",
        parent: "accordionTwo",
      },
      {
        id: "Three",
        title: "Information Sharing",
        desc: " Wood Eco may share personal information with employers and recruiters for job application purposes. However, Wood Eco does not sell, rent, or lease user information to third parties for marketing purposes. Wood Eco may also disclose personal information when required by law or to protect its rights or the safety of users.",
        parent: "accordionTwo",
      },
      {
        id: "Four",
        title: "Data Security",
        desc: " Wood Eco employs industry-standard security measures to protect user information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and Wood Eco cannot guarantee absolute security.",
        parent: "accordionTwo",
      },
      {
        id: "Five",
        title: "Third-Party Links",
        desc: "Wood Eco may contain links to third-party websites or services that are not owned or controlled by Wood Eco. This Privacy Policy applies only to information collected by Wood Eco, and Wood Eco is not responsible for the privacy practices or content of third-party websites.",
        parent: "accordionTwo",
      },
      {
        id: "Six",
        title: "Children's Privacy",
        desc: "Wood Eco is not intended for use by individuals under the age of 18, and Wood Eco does not knowingly collect personal information from children. If Wood Eco becomes aware that personal information has been collected from a child without parental consent, steps will be taken to delete the information as soon as possible.",
        parent: "accordionTwo",
      },
      {
        id: "Seven",
        title: "Changes to the Privacy Policy",
        desc: "Wood Eco reserves the right to update or revise this Privacy Policy at any time. Users will be notified of any changes to the Privacy Policy by posting the revised policy on the website. Continued use of the website after any modifications signifies acceptance of the updated Privacy Policy.",
        parent: "accordionTwo",
      },
      {
        id: "Eight",
        title: "Effective Date",
        desc: "This Privacy Policy is effective as of [Effective Date] and applies to all information collected by Wood Eco before or after the effective date.",
        parent: "accordionTwo",
      },
    ];
  
  export function PrivacyItems() {
    return (
      <div className="accordion accordion-style-two" id="accordionTwo">
        {privacy_data.map((f) => (
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

const PrivacyPolicy = () => {
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

export default PrivacyPolicy;
