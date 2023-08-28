package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.dao.CustomerRepository;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.entity.Customer;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        final Order order = purchase.getOrder();
        String orderTrackingNumber = setOrderTrackingNumber(order);
        processOrderItems(purchase, order);
        processShippingAndBillingAddress(purchase, order);
        processCustomer(purchase, order);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private void processCustomer(Purchase purchase, Order order) {
        Customer customer = purchase.getCustomer();
        Customer customerFromTheDB = customerRepository.findByEmail(customer.getEmail());
        if(customerFromTheDB != null) {
            customer = customerFromTheDB;
        }
        customer.addOrder(order);
        customerRepository.save(customer);
    }

    private String setOrderTrackingNumber(Order order) {
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        return orderTrackingNumber;
    }

    private static void processOrderItems(Purchase purchase, Order order) {
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);
    }

    private static void processShippingAndBillingAddress(Purchase purchase, Order order) {
        order.setShippingAddress(purchase.getBillingAddress());
        order.setBillingAddress(purchase.getShippingAddress());
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
