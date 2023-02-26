import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export const TICKET_TYPE = {
  ADULT: 'ADULT',
  CHILD: 'CHILD',
  INFANT: 'INFANT',
};

export const TICKET_PRICE = {
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

    const { totalCost, adultTickets, childTickets, infantTickets, noOfSeats } = this.#mapDataFromTicketTypeRequests(...ticketTypeRequests);

    // Handle invalid cases

    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('Please select at least one ticket type');
    }

    if ( isNaN(accountId) || accountId < 0 ) {
      throw new InvalidPurchaseException('Incorrect account id');
    }

    
    if ((childTickets || infantTickets )&& !adultTickets) {
      throw new InvalidPurchaseException('Please select at least one adult ticket');
    }

    if (infantTickets && infantTickets > adultTickets) {
      throw new InvalidPurchaseException('Infants have to sit on an adult lap, therefore the number of infants cannot be greater than the number of adults');
    }

    if(noOfSeats > 20) {
      throw new InvalidPurchaseException('Maximum 20 tickets can be purchased at a time');
    }

    // If all the above conditions are met, then proceed with payment and seat reservation

    const ticketPaymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();

    try {
      // assuming that makePayment method returns true if payment is successful
      const paymentRequest = ticketPaymentService.makePayment(accountId, totalCost);
      
      if (paymentRequest) {
        seatReservationService.reserveSeat(accountId, noOfSeats);
      }

      return totalCost;
    }
    catch (e) {
      throw new InvalidPurchaseException('Payment failed, please try again');
    }
  }

  // private method to map out the data from the ticketTypeRequests

  #mapDataFromTicketTypeRequests(...ticketTypeRequests) { 
    let totalCost = 0;
    let adultTickets = 0;
    let childTickets = 0;
    let infantTickets = 0;

    ticketTypeRequests.forEach((req) => {
      switch (req.getTicketType()) {
        case TICKET_TYPE.ADULT:
          adultTickets += req.getNoOfTickets();
          totalCost += adultTickets * TICKET_PRICE.ADULT;
          break;
        case TICKET_TYPE.CHILD:
          childTickets += req.getNoOfTickets();
          totalCost += childTickets * TICKET_PRICE.CHILD;
          break;
        case TICKET_TYPE.INFANT:
          infantTickets += req.getNoOfTickets();
          totalCost += infantTickets * TICKET_PRICE.INFANT;
          break;
        default:
          break;
      }

    });
    return {
      totalCost,
      adultTickets,
      childTickets,
      infantTickets,
      noOfSeats: adultTickets + childTickets + infantTickets
    }
  }
}



  

