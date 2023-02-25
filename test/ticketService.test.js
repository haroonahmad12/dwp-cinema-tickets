import 'jest';

import TicketService from '../src/pairtest/TicketService.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

import { TICKET_TYPE, TICKET_PRICE } from '../src/pairtest/TicketService.js';

describe('TicketService', () => {
  describe('purchaseTickets', () => {
    let ticketService;

    beforeEach(() => {
      ticketService = new TicketService();
    });
      const adultTicket = new TicketTypeRequest(TICKET_TYPE.ADULT, 2);
      const childTicket = new TicketTypeRequest(TICKET_TYPE.CHILD, 3);
      const infantTicket = new TicketTypeRequest(TICKET_TYPE.INFANT, 1);

      it("should throw an error if the id is not a number", () => {
          expect(() => {
              ticketService.purchaseTickets("123", new TicketTypeRequest(TICKET_TYPE.ADULT, 1));
          }).toThrow(InvalidPurchaseException);
    
          expect(() => {
              ticketService.purchaseTickets(-1, new TicketTypeRequest(TICKET_TYPE.ADULT, 1));
          }).toThrow(InvalidPurchaseException);
      });

      it("should throw an error if only child or infant tickets are selected", () => {
          expect(() => {
              ticketService.purchaseTickets(123, new TicketTypeRequest(TICKET_TYPE.CHILD, 1));
          }).toThrow(InvalidPurchaseException);
        
          expect(() => {
              ticketService.purchaseTickets(123, new TicketTypeRequest(TICKET_TYPE.INFANT, 1));
          }).toThrow(InvalidPurchaseException);
      });

      it("should throw an error if the total number of tickets is greater than 20", () => {
          expect(() => {
              ticketService.purchaseTickets(123, new TicketTypeRequest(TICKET_TYPE.ADULT, 21));
          }).toThrow(InvalidPurchaseException);
      });

      it("should calculate the total cost of the tickets", () => {  
          const totalCost = adultTicket.getNoOfTickets() * TICKET_PRICE.ADULT + childTicket.getNoOfTickets() * TICKET_PRICE.CHILD + infantTicket.getNoOfTickets() * TICKET_PRICE.INFANT;
          expect(ticketService.purchaseTickets(123, adultTicket, childTicket, infantTicket)).toEqual(totalCost);
      });

      it("should complete payment and reserve seats if all conditions are met", () => {
          const totalCost = adultTicket.getNoOfTickets() * TICKET_PRICE.ADULT + childTicket.getNoOfTickets() * TICKET_PRICE.CHILD + infantTicket.getNoOfTickets() * TICKET_PRICE.INFANT;
          expect(ticketService.purchaseTickets(123, adultTicket, childTicket, infantTicket)).toEqual(totalCost);
      });
  });
});

