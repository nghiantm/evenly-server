package com.evenly.service;

import com.evenly.Utility.SecurityUtility;
import com.evenly.dto.EqualExpenseCreateRequestDTO;
import com.evenly.entity.Expense;
import com.evenly.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    SecurityUtility securityUtility;

    public Expense get(String expenseId) {
        if (!expenseRepository.existsById(expenseId)) {
            throw new IllegalArgumentException("Expense with id " + expenseId + " not found");
        }
        return expenseRepository.getExpenseById(expenseId);
    }

    public List<Expense> getGroupExpenses(String groupId) {
        return expenseRepository.getExpensesByGroupIdOrderByCreatedDateDesc(groupId);
    }

    public Expense addExpense(EqualExpenseCreateRequestDTO expense) {
        Expense newExpense = new Expense();
        newExpense.setLabel(expense.getLabel());
        newExpense.setGroupId(expense.getGroupId());
        newExpense.setDescription(expense.getDescription());
        newExpense.setAmount(expense.getAmount());
        newExpense.setCreatedDate(Timestamp.valueOf(LocalDateTime.now()));
        newExpense.setPaidBy((String) securityUtility.getUserInfo().get("email"));

        return expenseRepository.save(newExpense);
    }

    public void delete(String expenseId) {
        if (!expenseRepository.existsById(expenseId)) {
            throw new IllegalArgumentException("Expense with id " + expenseId + " not found");
        }
        expenseRepository.deleteExpenseById(expenseId);
    }
}
