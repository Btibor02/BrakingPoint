<script setup lang="ts">
  import axios from "axios";
  import { Notify } from "quasar";
  import { onMounted } from "vue";
  import { useTicketsStore } from "../store/ticketsStore";
  const ticketsStore = useTicketsStore();
  Notify.setDefaults({
    position: "bottom",
    textColor: "white",
    timeout: 3000,
    actions: [{ icon: "close", color: "white" }],
    progress: true,
  });
  onMounted(() => {
    axios
      .get("http://localhost:8000/api/bets")
      .then((response) => {
        ticketsStore.data = response.data;
        const uniqueValues = new Set();
        ticketsStore.data.forEach((item) => {
          uniqueValues.add(item.category);
        });
        ticketsStore.fieldNames = Array.from(uniqueValues) as string[];
        ticketsStore.filteredData = [];
      })
      .catch((error) => {
        console.log(error);
      });
    ticketsStore.showTable = false;
  });
</script>
<template>
  <div>
    <q-btn
      color="primary"
      v-for="(categoryName, index) in ticketsStore.fieldNames"
      :key="index"
      @click="ticketsStore.filterData(categoryName)"
    >
      {{ categoryName }}
    </q-btn>

    <table v-if="ticketsStore.showTable">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Odds</th>
          <th>Odds2</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="ticketsStore.filteredData.length === 0">
          <td colspan="2">No data found</td>
        </tr>
        <tr v-for="(item, index) in ticketsStore.filteredData" :key="index">
          <td>{{ item.title }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.odds }}</td>
          <td v-if="item.category == 'versus'">{{ item.odds2 }}</td>
          <td><q-btn color="primary" @click="ticketsStore.openBetDialog(item)">Bet</q-btn></td>
        </tr>
      </tbody>
    </table>
    <q-dialog v-model="ticketsStore.showBetDialog" persistent>
      <q-card>
        <q-card-section>
          <div>
            Bet amount:
            <div v-if="ticketsStore.selectedItem.category == 'versus'" class="q-gutter-md">
              <q-radio v-model="ticketsStore.picked" val="first" label="Driver 1" />
              <q-radio v-model="ticketsStore.picked" val="second" label="Driver 2" />
            </div>
            <q-input v-model="ticketsStore.ticketBetAmount" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" @click="ticketsStore.closeBetDialog()" />
          <q-btn color="primary" label="Confirm" @click="ticketsStore.sendTicket()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    color: #555;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
</style>
