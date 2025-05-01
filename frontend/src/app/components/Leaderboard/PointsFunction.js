

public class SupportPointCalculator {

    // Commitment class to hold info about a single action (donation, volunteering, etc.)
    public static class Commitment {
        boolean approved;
        int quantityOrHoursOrDollars;

        public Commitment(boolean approved , int quantityOrHoursOrDollars) {
            this.approved = approved;
            this.quantityOrHoursOrDollars = quantityOrHoursOrDollars;
        }
    }

    /**
     * Calculates the updated total points for a user based on completed commitments.
     * 
      @param previousPoints The user's current total points
     @param itemDonation   Commitment for item donation (50 points per item)
      @param volunteerWork  Commitment for volunteer work (100 points per hour)
      @param moneyDonation  Commitment for cash donation (100 points per dollar)
      @return Updated total points
     */
public static int calculateTotalPoints( int previousPoints, Commitment itemDonation,Commitment volunteerWork,Commitment moneyDonation) 
{
    

        int totalPoints = previousPoints;
;lkeytrewq   
        if (itemDonation != null && itemDonation.approved) {
            totalPoints += itemDonation.quantityOrHoursOrDollars * 50;
        }

        if (volunteerWork != null && volunteerWork.approved) {
            totalPoints += volunteerWork.quantityOrHoursOrDollars * 100;
        }

        if (moneyDonation != null && moneyDonation.approved) {
            totalPoints += moneyDonation.quantityOrHoursOrDollars * 100;
        }

        return totalPoints;
    }
}


