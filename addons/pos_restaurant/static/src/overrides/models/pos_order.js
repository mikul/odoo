import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";

patch(PosOrder.prototype, {
    setup(_defaultObj, options) {
        super.setup(...arguments);
        if (this.config.module_pos_restaurant) {
            this.customerCount = this.customerCount || 1;
        }
    },
    getCustomerCount() {
        return this.customerCount;
    },
    setCustomerCount(count) {
        this.customerCount = Math.max(count, 0);
    },
    getTable() {
        if (this.config.module_pos_restaurant) {
            return this.table_id;
        }
    },
    amountPerGuest(numCustomers = this.customerCount) {
        if (numCustomers === 0) {
            return 0;
        }
        return this.getTotalDue() / numCustomers;
    },
    export_for_printing(baseUrl, headerData) {
        return {
            ...super.export_for_printing(...arguments),
            set_tip_after_payment: this.config.set_tip_after_payment,
            isRestaurant: this.config.module_pos_restaurant,
        };
    },
    setBooked(booked) {
        this.uiState.booked = booked;
    },
    getOrderName() {
        return this.table_id?.table_number.toString() || this.getFloatingOrderName() || "";
    },
});
