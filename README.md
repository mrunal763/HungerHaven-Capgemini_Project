# HungerHaven - Online Food Ordering System

**Author**: Mrunal Somanker  
**Project Name**: HungerHaven  
**Description**: HungerHaven is an online food ordering system that allows users to browse restaurants, select food items, and place orders. The system includes features for customer registration, order management, and reporting.

---

## Features

- **User Management**: Register and manage customer accounts.
- **Restaurant Management**: Browse restaurants and their menus.
- **Order Placement**: Place orders with multiple food items.
- **Reports & Charts**: View sales reports and order trends.

---

## Database Schema

### Tables
- **Users**(UserID, Name, Email, Password, Phone, UserType)  
- **Restaurants**(RestaurantID, Name, Location, Contact)  
- **FoodItems**(ItemID, Name, Price, RestaurantID)  
- **Orders**(OrderID, UserID, RestaurantID, OrderDate, TotalAmount)  
- **OrderItems**(OrderItemID, OrderID, ItemID, Quantity)  

---

## How to Run

1. **Prerequisites**: Ensure you have Node.js and json server installed on your system.
2. **Clone the Repository**:  
   ```bash
   git clone <repository-url>
   cd json
   ```
3. **Set Up JSON Server**:  
   Navigate to the folder containing the JSON file and run:  
   ```bash
   npx json-server food.json
   ```
   This will start a local server (default: `http://localhost:3000`).

4. **Open the Project**:  
   Launch the `Home.html` file in a web browser to start using HungerHaven.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: JSON Server (for mock API)  

---

## Project Structure

- **Master Forms**:
  - Restaurant Master  
  - Food Item Master  
  - Customer Registration  

- **Transaction Forms**:
  - Place Order  

- **Queries**:
  - Orders by a customer  
  - Items sold per restaurant  

- **Reports**:
  - Order-wise item report  
  - Daily order summary  

- **Charts**:
  - Bar chart: Sales per restaurant  
  - Line chart: Orders per day  

---

## Screenshots
![image](https://github.com/user-attachments/assets/9f572135-f547-4a3f-8d3f-0e0193209351)


**Happy Ordering!** 🍔🍕
