import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

const TICKET_TYPE = {
  ADULT: 'ADULT',
  CHILD: 'CHILD',
  INFANT: 'INFANT',
};

const TICKET_PRICE = {
  ADULT: 20,
  CHILD: 10,
  INFANT: 0,
};

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    let adultTickets;
    let childTickets;
    let infantTickets;

    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('Please select at least one ticket type');
    }

    if ( typeof accountId !== "number" ) {
      throw new InvalidPurchaseException('Incorrect account id');
    }

    ticketTypeRequests.forEach((ticketTypeRequest) => {

      switch (ticketTypeRequest.getTicketType()) {
        case TICKET_TYPE.ADULT:
          adultTickets = ticketTypeRequest.getNoOfTickets();
          break;
        case TICKET_TYPE.CHILD:
          childTickets = ticketTypeRequest.getNoOfTickets();
          break;
        case TICKET_TYPE.INFANT:
          infantTickets = ticketTypeRequest.getNoOfTickets();
          break;
        default:
          throw new InvalidPurchaseException('Incorrect ticket type');
      }
      
    });

    if ((childTickets || infantTickets )&& !adultTickets) {
      throw new InvalidPurchaseException('Please select at least one adult ticket');
    }

    if (infantTickets && infantTickets > adultTickets) {
      throw new InvalidPurchaseException('Infant sit on adult lap and cannot be more than the number of adults');
    }

    if(adultTickets + childTickets  + infantTickets > 20) {
      throw new InvalidPurchaseException('Maximum 20 tickets can be purchased at a time');
    }

    const totalCost = (adultTickets * TICKET_PRICE.ADULT) + (childTickets * TICKET_PRICE.CHILD) + (infantTickets * TICKET_PRICE.INFANT);
    
    const totalSeats = adultTickets + childTickets;

    const ticketPaymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();

    try {
      // assuming that makePayment method returns true if payment is successful
      const paymentRequest = ticketPaymentService.makePayment(accountId, totalCost)
      
      if (paymentRequest) {
        seatReservationService.reserveSeats(totalSeats);
      }
    }
    catch (e) {
      throw new InvalidPurchaseException('Payment failed, please try again');
    }
  }
}



  

