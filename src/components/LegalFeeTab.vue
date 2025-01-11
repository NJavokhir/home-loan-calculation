<template>
  <v-card class="legalfee-card">
    <div class="stamp-duty">
      Stamp duty will be only RM10.00 for first time home buyers <strong style="text-decoration: underline;">See
        more</strong>
    </div>

    <div class="buying-house">
      <v-checkbox v-model="isChecked" hide-details label="First time buying house"></v-checkbox>
    </div>

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

    <v-btn @click="calculateLegalFee" class="calculate-btn">Calculate</v-btn>

    <!-- <div>
      <h4 class="font-weight-medium text-left mb-4">Result</h4>
      <div class="d-flex justify-space-between align-center w-full rounded-lg py-4 px-4 bg-white mb-4">
        <p class="text-caption">Monthly Payment (RM): </p>
        <strong>{{ formattedLegalFee }}</strong>
      </div>
    </div> -->

    <div class="legal-result" v-if="legalFee">
      <h4 class="font-weight-medium text-left mb-4">Results</h4>
      <div class="d-flex justify-space-between align-center mb-4">
        <p class="text-caption">S&P Legal Fee (RM) </p>
        <strong>{{ formattedLegalFee }}</strong>
      </div>
      <div class="d-flex justify-space-between align-center mb-4">
        <p class="text-caption">S&P Stamp Duty (RM) </p>
        <strong>{{ formattedLegalFee }}</strong>
      </div>
      <div class="d-flex justify-space-between align-center">
        <p class="text-caption">Total (RM) </p>
        <strong>{{ formattedLegalFee }}</strong>
      </div>
    </div>

    <div class="note-class">
      <strong>Note:</strong> Exclude disbursement fee, SST and other misc charge, please consult your lawyer, the legal
      fee for property price exceeding RM7.5 million is negotiable, but subjected to maximum of 1%
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const propertyPrice = ref('');
const downPayment = ref('');
const downPaymentType = ref("RM");
const legalFee = ref(null);
const isChecked = ref(false);

watch([propertyPrice, downPaymentType], () => {
  if (downPaymentType.value === "RM") {
    downPayment.value = (propertyPrice.value * downPayment.value) / 100;
  } else if (downPaymentType.value === "%") {
    downPayment.value = propertyPrice.value > 0 ? (downPayment.value / propertyPrice.value) * 100 : 0;
  }
});

const toggleDownPaymentType = (type) => {
  downPaymentType.value = type;
};

const calculateLegalFee = () => {
  const price = parseFloat(propertyPrice.value) || 0;

  if (price <= 500000) {
    legalFee.value = price * 0.01; // 1% for property <= RM 500,000
  } else if (price <= 1000000) {
    legalFee.value = 5000 + (price - 500000) * 0.008; // 0.8% for property between RM 500,001 and RM 1,000,000
  } else if (price <= 3000000) {
    legalFee.value = 9000 + (price - 1000000) * 0.006; // 0.6% for property between RM 1,000,001 and RM 3,000,000
  } else if (price <= 7500000) {
    legalFee.value = 21000 + (price - 3000000) * 0.005; // 0.5% for property between RM 3,000,001 and RM 7,500,000
  } else {
    legalFee.value = Math.min(46000 + (price - 7500000) * 0.01, price * 0.01); // Negotiable for > RM 7,500,000
  }
};

const formattedLegalFee = computed(() => {
  return legalFee.value.toFixed(2);
});
</script>


<style scoped>
.legalfee-card {
  padding: 0px;
  border: none;
  box-shadow: none;
  background-color: #FAFBFB;
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

.note-class {
  width: 100%;
  border-radius: 8px;
  background-color: #FFE7D0;
  border: 1px solid #EDEDF3;
  padding: 12px;
  font-size: 14px;
  font-weight: 400;
  color: #FF8C1B;
  line-height: 22px;
}

.stamp-duty {
  width: 100%;
  font-size: 14px;
  color: #6B6F89;
  line-height: 20px;
  margin-bottom: 16px;
  font-weight: 300;
}

.calculate-btn {
  margin-top: 12px;
}

.buying-house {
  width: 100%;
  border: 1px solid #DBDEEB;
  background-color: #F1F2F8;
  /* font-size: 14px;
  font-weight: 400;
  color: #6B6F89; */
  border-radius: 16px;
  margin-bottom: 16px;
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

.v-btn.v-btn--density-default {
    height: 100%;
}

.legal-result {
  width: 100%;
  border: 1px solid #EDEDF3;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>