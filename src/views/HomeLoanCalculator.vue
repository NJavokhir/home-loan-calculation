<template>
    <v-app>
        <v-app-bar app class="bg-white" elevation="0">
            <v-btn icon @click="goBack">
                <v-icon class="w-6 h-6">mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title class="text-center font-weight-medium ml-n5">Calculator</v-toolbar-title>
        </v-app-bar>

        <v-container>
            <v-tabs v-model="activeTab" align-tabs="center mt-16 mb-6" style="content: none;">
                <v-tab>Mortgage</v-tab>
                <v-tab>EPF Withdrawal</v-tab>
                <v-tab>Legal Fee</v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">
                <v-tab-item v-if="activeTab === 0">
                    <MortgageTab />
                </v-tab-item>
                <v-tab-item v-if="activeTab === 1">
                    <EPFWithdrawalTab />
                </v-tab-item>
                <v-tab-item v-if="activeTab === 2">
                    <LegalFeeTab />
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MortgageTab from "@/components/MortgageTab.vue";
import EPFWithdrawalTab from "@/components/EpfWithdrawalTab.vue";
import LegalFeeTab from "@/components/LegalFeeTab.vue";

const activeTab = ref(0);

const router = useRouter();
const goBack = () => {
    router.back();
}
</script>

<style scoped>

.v-tab {
    font-weight: 500;
    border-radius: 20px !important;
    padding: 4px 8px !important;
    transition: background-color 0.3s ease;
    margin-right: 8px;
    background-color: #F4F4F7;
    text-transform: none;
    align-self: center;
}

.v-tabs--density-default {
    --v-tabs-height: 30px;
}

.v-btn::after {
    display: none !important;
}

.v-tab--selected {
    background-color: #E5F8F7 !important;
    color: #00B5B0;
    border: none;
}

[class^="v-"]::before,
[class^="v-"]::after {
    content: none !important;
    display: none !important;
}
</style>