<template>
  <!-- Card container for the EPF form -->
  <v-card class="epf-card">

    <!-- Radio group for selecting the withdrawal purpose -->
    <v-radio-group inline v-model="withdrawalPurpose" hide-details class="mb-5">
      <v-row>
        <v-col cols="6">
          <v-radio value="purchase" class="purpose-radio" color="#00B5B0"
            :class="{ 'selected-radio': withdrawalPurpose === 'purchase' }">
            <template #label>
              <span :class="withdrawalPurpose === 'purchase' ? 'selected-label' : 'default-label'">
                Withdrawal to purchase/build a house
              </span>
            </template>
          </v-radio>
        </v-col>
        <v-col cols="6">
          <v-radio value="redeem" class="purpose-radio" color="#00B5B0"
            :class="{ 'selected-radio': withdrawalPurpose === 'redeem' }">
            <template #label>
              <span :class="withdrawalPurpose === 'redeem' ? 'selected-label' : 'default-label'">
                Withdrawal to reduce/redeem a housing loan
              </span>
            </template>
          </v-radio>
        </v-col>
      </v-row>
    </v-radio-group>

    <!-- Calculator section -->
    <h4 class="font-weight-medium text-left mb-4">Calculator</h4>
    <div class="input-group">
      <v-label class="custom-label">Property Price</v-label>
      <v-text-field v-model="maskedPrice" type="text" class="input-field" hide-details hide-spin-buttons
        placeholder="Property Price" @input="handleInput('price', $event)">
        <template #prepend-inner>
          <span class="prepend-text">RM</span>
        </template>
      </v-text-field>

      <v-label class="custom-label">Loan Amount</v-label>
      <v-text-field v-model="maskedLoan" type="text" class="input-field" hide-details hide-spin-buttons
        placeholder="Loan Amount" @input="handleInput('loan', $event)">
        <template #prepend-inner>
          <div class="prepend-class">
            <span :class="{ active: loanAmountType === '%' }" @click="toggleDownPaymentType('%')">
              %
            </span>
            <span :class="{ active: loanAmountType === 'RM' }" @click="toggleDownPaymentType('RM')">
              RM
            </span>
          </div>
        </template>
      </v-text-field>

      <v-label class="custom-label">Balance in Account II</v-label>
      <v-text-field v-model="maskedBalance" type="text" class="input-field" hide-details hide-spin-buttons
        placeholder="Balance in Account II" @input="handleInput('balance', $event)">
        <template #prepend-inner>
          <span class="prepend-text">RM</span>
        </template>
      </v-text-field>
    </div>

    <v-btn @click="calculateLoanToValue" class="calculate-btn">Calculate</v-btn>

    <!-- Display result after calculation -->
    <div v-if="fundCanBeWithdrawn">
      <h4 class="font-weight-medium text-left mb-4">Result</h4>
      <div class="d-flex justify-space-between align-center w-full rounded-lg py-4 px-4 bg-white mb-4"
        v-if="fundCanBeWithdrawn !== null">
        <p class="text-caption">Fund can be withdraw (RM): </p>
        <strong>{{ fundCanBeWithdrawn }}</strong>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formatCurrency } from "@/utils/currencyUtils";

// Defining reactive state variables for user inputs and results
const propertyPrice = ref('');
const loanAmount = ref('');
const balanceAccount = ref('');

const withdrawalPurpose = ref('purchase');
const fundCanBeWithdrawn = ref(null);
const loanAmountType = ref('%');

const maskedPrice = ref('');
const maskedLoan = ref('');
const maskedBalance = ref('');

// Watch for changes in loanAmount when loanAmountType is '%'
watch(() => loanAmount.value, (newLoanAmount) => {
  if (loanAmountType.value === '%' && newLoanAmount > 100) {
    alert('The loan amount cannot exceed 100%. Please enter a valid loan amount.');
    loanAmount.value = '';
    maskedLoan.value = '';
  }
});

// Function to handle input and update both masked and actual value
const handleInput = (field, event) => {
  let rawValue = event.target.value.replace(/[^\d.]/g, '');

  if (rawValue.startsWith('-')) {
    rawValue = rawValue.slice(1);
  }
  if (field === 'price') {
    propertyPrice.value = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
    maskedPrice.value = formatCurrency(rawValue);
  } else if (field === 'loan') {
    loanAmount.value = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
    maskedLoan.value = formatCurrency(rawValue);
  } else if (field === 'balance') {
    balanceAccount.value = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
    maskedBalance.value = formatCurrency(rawValue);
  }
};

// Function to toggle loan amount type (percentage or RM)
const toggleDownPaymentType = (type) => {
  loanAmountType.value = type;
  loanAmount.value = ''
  maskedLoan.value = ''
};

// Function to calculate the maximum fund that can be withdrawn
const calculateLoanToValue = () => {
  const price = parseFloat(propertyPrice.value) || 0;
  const loan = parseFloat(loanAmount.value) || 0;
  const balance = parseFloat(balanceAccount.value) || 0;

  if (price <= 0 || loan <= 0 || balance <= 0) {
    alert('Please fill all the fields with valid values.');
    fundCanBeWithdrawn.value = null;
    return;
  }

  let fund = 0;

  if (withdrawalPurpose.value === 'purchase') {
    // Loan amount in RM (can be % or fixed amount)
    const loanInRM = loanAmountType.value === '%' ? (loan / 100) * price : loan;

    // Calculate the maximum eligible withdrawal amount
    const eligibleWithdrawal = (price - loanInRM) + (0.1 * price);

    // The actual amount withdrawable is the lower of Account II balance or the eligible withdrawal amount
    fund = Math.min(eligibleWithdrawal, balance);
  } else if (withdrawalPurpose.value === 'redeem') {
    // For redeem, withdrawal is limited to the lower of Outstanding Loan Balance or Account II Balance
    const loanInRM = loanAmountType.value === '%' ? (loan / 100) * price : loan;

    fund = Math.min(loanInRM, balance);
  }

  // Update the reactive variable for the result
  fundCanBeWithdrawn.value = fund.toLocaleString();
};
</script>

<style scoped>
.epf-card {
  padding: 0px;
  border: none;
  box-shadow: none;
  background-color: #FAFBFB;
}

.purpose-radio {
  border: 1px solid #EDEDF3;
  padding: 5px 10px 5px 0px;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  background-color: white;
}

.purpose-radio.selected-radio {
  border: 1px solid #00B5B0;
}

.default-label {
  font-size: 12px;
  font-weight: 400;
  color: #6B6F89;
  white-space: normal;
  word-wrap: break-word;
  line-height: 14px;
}

.selected-label {
  font-size: 12px;
  font-weight: 400;
  color: #00B5B0;
  white-space: normal;
  word-wrap: break-word;
  line-height: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 100%;
  border: 1px solid #C3C7D9 !important;
  border-radius: 16px;
  color: #1B1B1B;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
  background-color: #FAFBFB;
  padding: 20px auto;
}

.custom-label {
  font-size: 12px;
  font-weight: 300;
  color: #6B6F89;
  margin-bottom: 8px;
  display: block;
  line-height: 18px;
}

.prepend-text,
.prepend-class span {
  width: 100%;
  color: #6b6f89;
  font-weight: 400;
  margin-right: 0px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
}

.prepend-class span.active {
  color: #00b5b0;
  font-weight: 600;
  padding: 4px;
  background-color: white;
  border-radius: 8px;
}

.prepend-class {
  width: 64px;
  display: flex;
  padding: 2px;
  background-color: #F1F2F8;
  border-radius: 8px;
  align-items: center;
}

.prepend-text::after {
  content: "|";
  margin-left: 8px;
  color: #EDEDF3;
  font-weight: 400;
}

.calculate-btn {
  width: 100%;
  height: 52px;
  background-color: #00B5B0;
  color: #F9F8F8;
  text-align: center;
  padding: 14px 16px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-transform: none;
  margin-bottom: 24px;
}
</style>
