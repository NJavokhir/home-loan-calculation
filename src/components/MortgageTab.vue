<template>
  <v-card class="mortgage-card">
    <div class="mortgage">
      <!-- Mortgage Breakdown Section -->
      <div class="mortgage-breakdown">
        <div class="mortgage-breakdown-title">
          Mortgage Breakdown
        </div>
        <!-- Monthly Repayment Display -->
        <div class="payment-container">
          <p class="text-caption">Est. Monthly Repayment</p>
          <p class="text-caption">{{ monthlyPayment }} RM</p>
        </div>
        <!-- Progress Bars for Principal and Interest -->
        <div class="progress-container">
          <div :style="{ width: principalPercentage + '%' }" class="dynamic-left-bar dynamic-bar">
            {{ principalPercentage }}%
          </div>
          <div class="dynamic-right-bar dynamic-bar" :style="{ width: interestPercentage + '%' }">
            {{ interestPercentage }}%
          </div>
        </div>
        <!-- Breakdown details for Principal and Interest Amount -->
        <div class="breakdown-details">
          <span class="breakdown-principal">RM {{ principalAmount }} Principal</span>
          <span class="breakdown-interest">RM {{ interestAmount }} Interest</span>
        </div>
      </div>

      <!-- Upfront Costs Section -->
      <div>
        <div class="mortgage-breakdown-title">
          Upfront Costs
        </div>
        <!-- Total Downpayment Display -->
        <div class="payment-container">
          <p class="text-caption">Total Downpayment</p>
          <p class="text-caption">{{ downPayment }} RM</p>
        </div>
        <!-- Progress Bars for Downpayment and Loan Amount -->
        <div class="progress-container">
          <div class="dynamic-left-bar dynamic-bar" :style="{ width: downpaymentPercentage + '%' }">
            {{ downpaymentPercentage }}%
          </div>
          <div class="dynamic-right-bar dynamic-bar" :style="{ width: loanPercentage + '%' }">
            {{ loanPercentage }}%
          </div>
        </div>
        <!-- Breakdown details for Downpayment and Loan Amount -->
        <div class="breakdown-details">
          <span class="breakdown-principal">RM {{ downPayment }} Downpayment</span>
          <span class="breakdown-interest">RM {{ interestAmount }} Loan amount</span>
        </div>
      </div>
    </div>

    <!-- Calculator Section -->
    <h4 class="font-weight-medium text-left mb-4">Calculator</h4>
    <div class="input-group">
      <v-label class="custom-label">Property Price</v-label>
      <v-text-field v-model="propertyPrice" type="number" class="input-field" hide-details placeholder="Property Price">
        <template #prepend-inner>
          <span class="prepend-text">RM</span>
        </template>
      </v-text-field>


      <v-label class="custom-label">Downpayment</v-label>
      <v-text-field v-model="downPayment" type="number" class="input-field" hide-details placeholder="Downpayment">
        <template #prepend-inner>
          <div class="prepend-class">
            <span :class="{ active: downPaymentType === '%' }" @click="toggleDownPaymentType('%')">
              %
            </span>
            <span :class="{ active: downPaymentType === 'RM' }" @click="toggleDownPaymentType('RM')">
              RM
            </span>
          </div>
        </template>
      </v-text-field>

      <v-row>
        <v-col cols="6">
          <v-label class="custom-label">Interest Rate</v-label>
          <v-text-field v-model="interestRate" type="number" class="input-field" hide-details
            placeholder="Interest Rate">
            <template #prepend-inner>
              <span class="prepend-text">%</span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-label class="custom-label">Loan Tenure</v-label>
          <v-text-field v-model="loanTenure" type="number" class="input-field" hide-details placeholder="Loan">
            <template #prepend-inner>
              <span class="prepend-text">Yrs</span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>

    <v-btn @click="calculateMortgage" class="calculate-btn">Calculate</v-btn>

    <!-- Display Result if Monthly Payment is Calculated -->
    <div v-if="monthlyPayment !== null">
      <h4 class="font-weight-medium text-left mb-4">Result</h4>
      <div class="d-flex justify-space-between align-center w-full rounded-lg py-4 px-4 bg-white mb-4">
        <p class="text-caption">Monthly Payment (RM): </p>
        <strong>{{ monthlyPayment }}</strong>
      </div>
    </div>

  </v-card>
</template>

<script setup>
import { ref, watch, computed } from "vue";

// Define reactive variables
const propertyPrice = ref('');
const downPayment = ref('');
const downPaymentType = ref("RM");
const interestRate = ref('');
const loanTenure = ref('');
const monthlyPayment = ref(null);
const interestPercentage = ref(50);
const principalPercentage = ref(50);

// Toggle downpayment type between 'RM' and '%'
const toggleDownPaymentType = (type) => {
  downPaymentType.value = type;
};

// Function to calculate the mortgage
const calculateMortgage = () => {
  if (!propertyPrice.value || !interestRate.value || !loanTenure.value) {
    monthlyPayment.value = null;
    alert("Please fill all the fields correctly.");
    return;
  }

  const loanAmount = propertyPrice.value - downPayment.value;
  const annualInterestRate = interestRate.value / 100;
  const monthlyInterestRate = annualInterestRate / 12;
  const totalPayments = loanTenure.value * 12;

  if (loanAmount > 0 && monthlyInterestRate > 0 && totalPayments > 0) {
    const mortgagePayment =
      (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    monthlyPayment.value = mortgagePayment.toFixed(2);

    // Calculate principal and interest percentages
    const totalAmount = mortgagePayment * totalPayments;
    principalPercentage.value = ((loanAmount / totalAmount) * 100).toFixed(2);
    interestPercentage.value = (100 - principalPercentage.value).toFixed(2);
  } else {
    monthlyPayment.value = null;
  }
};

// Static percentages for downpayment and loan
const downpaymentPercentage = ref(74);
const loanPercentage = ref(26);

// Computed properties for interest and principal amounts
const interestAmount = computed(() => {
  const monthlyInterestRate = interestRate.value / 100 / 12;
  const interest = monthlyPayment.value * monthlyInterestRate;
  return parseFloat(interest.toFixed(2));
});

const principalAmount = computed(() => {
  const principal = monthlyPayment.value - interestAmount.value;
  return parseFloat(principal.toFixed(2));
});
</script>

<style scoped>
.mortgage-card {
  padding: 0px;
  border: none;
  box-shadow: none;
  background-color: #FAFBFB;
}

.mortgage {
  padding: 12px;
  background-color: white;
  border: 1px solid #EDEDF3;
  border-radius: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
}

.mortgage-breakdown {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #EDEDF3;
}

.mortgage-breakdown-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.payment-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.text-caption {
  font-size: 12px;
  line-height: 22px;
  font-weight: 500;
}

.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
  text-align: center;
  color: white;
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

.dynamic-bar {
  height: 20px;
  font-size: 10px;
  font-weight: 500;
  align-content: center;
}

.dynamic-left-bar {
  border-top-left-radius: 28px;
  border-bottom-left-radius: 28px;
  background-color: #184041;
}

.dynamic-right-bar {
  border-top-right-radius: 28px;
  border-bottom-right-radius: 28px;
  background-color: #3F8F93;
}

.breakdown-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
}

.breakdown-principal {
  position: relative;
  margin-left: 10px;
}

.breakdown-principal::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #184041;
  top: 4px;
  left: 0;
  margin-left: -10px;
}

.breakdown-interest {
  position: relative;
}

.breakdown-interest::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3F8F93;
  top: 4px;
  left: 0;
  margin-left: -10px;
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