import { Router, Request, Response } from 'express';
import { config } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import { rateLimitEnquiries } from '../middleware/rateLimit.js';
import { familyEnquirySchema, carePartnerEnquirySchema } from '../validators/index.js';
import { EnquiryDeliveryError, sendEnquiryEmail } from '../services/enquiryMailer.js';

export const enquiriesRouter = Router();
const enquiryLimit = rateLimitEnquiries({ maxRequests: 4, windowMs: 10 * 60 * 1000 });

enquiriesRouter.post(
  '/memorial',
  enquiryLimit,
  validateBody(familyEnquirySchema),
  async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await sendEnquiryEmail({
        to: config.enquiries.familyDestination,
        replyTo: data.email,
        subject: `Begin a Memorial enquiry — ${data.personName}`,
        heading: 'A family would like to begin a memorial',
        intro: 'A new private family enquiry has been received through the Palm & Grace website.',
        lines: [
          ['Your name', data.yourName],
          ['Email', data.email],
          ['Telephone / WhatsApp', data.telephone],
          ['Person being remembered', data.personName],
          ['Relationship', data.relationship],
          ['Arrangements underway', data.hasArrangements],
          ['Funeral home / service provider', data.funeralHome],
          ['Anticipated service date', data.serviceDate],
          ['Anything else', data.additionalInfo],
        ],
      });

      return res.status(202).json({
        success: true,
        message: 'Thank you for reaching out to Palm & Grace. Your enquiry has been received. A member of our team will be in touch to guide you through the next steps with care.',
      });
    } catch (error) {
      console.error('[Family enquiry] Delivery failed:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(error instanceof EnquiryDeliveryError ? 503 : 500).json({
        success: false,
        error: 'We could not receive your enquiry just now. Please try again shortly.',
      });
    }
  }
);

enquiriesRouter.post(
  '/partnership',
  enquiryLimit,
  validateBody(carePartnerEnquirySchema),
  async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await sendEnquiryEmail({
        to: config.enquiries.carePartnerDestination,
        replyTo: data.email,
        subject: `Care Partner enquiry — ${data.organisationName}`,
        heading: 'A new Care Partner conversation',
        intro: 'A funeral home or bereavement professional would like to explore working with Palm & Grace.',
        lines: [
          ['Organisation / funeral home', data.organisationName],
          ['Contact person', data.contactPerson],
          ['Role', data.role],
          ['Email', data.email],
          ['Telephone', data.telephone],
          ['Location / service area', data.location],
          ['What they would like to explore', data.enquiry],
        ],
      });

      return res.status(202).json({
        success: true,
        message: 'Thank you for reaching out to Palm & Grace. Your Care Partner enquiry has been received, and a member of our team will be in touch.',
      });
    } catch (error) {
      console.error('[Care Partner enquiry] Delivery failed:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(error instanceof EnquiryDeliveryError ? 503 : 500).json({
        success: false,
        error: 'We could not receive your enquiry just now. Please try again shortly.',
      });
    }
  }
);
