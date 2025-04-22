import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/formHandler")
public class FormHandler extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String textEntry = request.getParameter("text-entry");
        String multipleChoice = request.getParameter("choice");
        String dateSelection = request.getParameter("date-selection");
        String[] checklist = request.getParameterValues("checklist");

        response.setContentType("text/html");
        response.getWriter().println("<h1>Form Submission Results</h1>");
        response.getWriter().println("<p>Text Entry: " + textEntry + "</p>");
        response.getWriter().println("<p>Multiple Choice: " + multipleChoice + "</p>");
        response.getWriter().println("<p>Date Selection: " + dateSelection + "</p>");
        if (checklist != null) {
            response.getWriter().println("<p>Checklist Selection: " + String.join(", ", checklist) + "</p>");
        } else {
            response.getWriter().println("<p>Checklist Selection: None</p>");
        }

        function toggleVisibility(id) {
            const checkbox = document.getElementById(id + '-checkbox');
            const section = document.getElementById(id);
            
            // Toggle the visibility of the section based on the checkbox state
            if (checkbox.checked) {
                section.style.display = 'block'; // Show the section
            } else {
                section.style.display = 'none'; // Hide the section
            }
        }
    }
}
