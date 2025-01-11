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
      <v-text-field v-model="propertyPrice" type="number" class="input-field" hide-details placeholder="Property Price">
        <template #prepend-inner>
          <span class="prepend-text">RM</span>
        </template>
      </v-text-field>


      <v-label class="custom-label">Loan Amount</v-label>
      <v-text-field v-model="loanAmount" type="number" class="input-field" hide-details placeholder="Loan Amount">
        <template #prepend-inner>
          <span class="prepend-text">RM</span>
        </template>
      </v-text-field>

      <v-label class="custom-label">Balance in Account II</v-label>
      <v-text-field v-model="balanceAccount" type="number" class="input-field" hide-details
        placeholder="Balance in Account II">
        <template #prepend-inner>
          <span class="prepend-text">RM</span>
        </template>
      </v-text-field>
    </div>

    <v-btn @click="calculateLoanToValue" class="calculate-btn">Calculate</v-btn>

    <!-- Display result after calculation -->
    <div v-if="ltvResult">
      <h4 class="font-weight-medium text-left mb-4">Result</h4>
      <div class="d-flex justify-space-between align-center w-full rounded-lg py-4 px-4 bg-white mb-4"
        v-if="ltvResult !== null">
        <p class="text-caption">Fund can be withdraw rate (%): </p>
        <strong>{{ ltvResult }}%</strong>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

// Defining reactive state variables for user inputs and result
const propertyPrice = ref('');
const loanAmount = ref('');
const balanceAccount = ref('');
const withdrawalPurpose = ref('purchase');
const ltvResult = ref(null);
const remainingBalance = ref(null);

// Function to calculate the Loan-To-Value (LTV) based on the selected purpose
const calculateLoanToValue = () => {
  if (!propertyPrice.value || !loanAmount.value || !balanceAccount.value) {
    alert("Please fill all the fields correctly.");
    return;
  }

  const price = parseFloat(propertyPrice.value);
  const loan = parseFloat(loanAmount.value);
  const balance = parseFloat(balanceAccount.value);

  let result = null;

  if (withdrawalPurpose.value === 'purchase') {
    result = (loan / price) * 100;
  } else if (withdrawalPurpose.value === 'redeem') {
    result = ((loan + balance) / price) * 100;
  }

  if (result !== null) {
    ltvResult.value = result.toFixed(2);
  } else {
    ltvResult.value = null;
  }

  remainingBalance.value = balance.toFixed(2);
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

.prepend-text {
  color: #6B6F89;
  font-weight: 400;
  margin-right: 8px;
  font-size: 14px;
  line-height: 16px;
  word-wrap: break-word;
  position: relative;
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
