import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import '../../services/Footer.css';  // Updated import path to point to services directory

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
//       <div className="mb-2">
//         &copy; {new Date().getFullYear()} Online Event Ticketing System. All rights reserved.
//       </div>
      
//       <div className="mb-2 font-medium">
//         Contact & Support:
//       </div>

//       <div className="space-x-6">
//         <a
//           href="https://www.instagram.com/gannahelbadry?igsh=MXZmaG13MjQ0azQyNQ=="
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-pink-400 font-bold inline-flex items-center"
//         >
//           <FaInstagram className="mr-1" /> Instagram
//         </a>
//         <a
//           href="https://www.tiktok.com/@gannahelbadry?_t=ZS-8wWB8bEyy14&_r=1"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-pink-400 font-bold inline-flex items-center"
//         >
//           <FaTiktok className="mr-1" /> TikTok
//         </a>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          &copy; {new Date().getFullYear()} Online Event Ticketing System. All rights reserved.
        </div>
        
        <div className="contact-title">
          Contact & Support
        </div>

        <div className="social-links">
          <a
            href="https://www.instagram.com/gannahelbadry?igsh=MXZmaG13MjQ0azQyNQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram-link"
          >
            <FaInstagram className="social-icon" />
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@gannahelbadry?_t=ZS-8wWB8bEyy14&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link tiktok-link"
          >
            <FaTiktok className="social-icon" />
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;