package com.college.campusconnect.controller;

import com.college.campusconnect.entity.Registration;
import com.college.campusconnect.exception.ResourceNotFoundException;
import com.college.campusconnect.repository.RegistrationRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final RegistrationRepository registrationRepository;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        try {
            // 1. Verify Signature using Razorpay Utils
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid) {
                // 2. Update Registration Status to PAID
                Registration registration = registrationRepository.findByRazorpayOrderId(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Registration not found for order: " + orderId));

                registration.setPaymentStatus("PAID");
                registration.setRazorpayPaymentId(paymentId);
                registrationRepository.save(registration);

                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "failure", "message", "Invalid signature"));
            }

        } catch (RazorpayException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}