<template>
  <div class="home">
    <div class="table">
      <div class="table__navigate-btn">
        <button @click="showModal = !showModal" type="button">СОЗДАТЬ</button>
      </div>
      <div class="table__filter-block">
        <div class="search-container">
          <input
            type="text"
            placeholder="Поиск (№ заявки, название)"
            aria-label="Поиск"
          />
          <span class="search-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
                fill="#999999"
              />
            </svg>
          </span>
        </div>
        <select aria-label="Фильтр">
          <option>Дом</option>
          <option>Город</option>
        </select>
      </div>
      <table class="styled-table">
        <thead>
          <tr>
            <th>
              <div>
                №
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_972_101"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                  >
                    <rect width="16" height="16" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_972_101)">
                    <path
                      d="M7.33333 12V5.86668L4.93333 8.26668L4 7.33334L8 3.33334L12 7.33334L11.0667 8.26668L8.66667 5.86668V12H7.33333Z"
                      fill="#CCCCCC"
                    />
                  </g>
                </svg>
              </div>
            </th>
            <th>
              <div>
                Создана
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_972_101"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                  >
                    <rect width="16" height="16" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_972_101)">
                    <path
                      d="M7.33333 12V5.86668L4.93333 8.26668L4 7.33334L8 3.33334L12 7.33334L11.0667 8.26668L8.66667 5.86668V12H7.33333Z"
                      fill="#CCCCCC"
                    />
                  </g>
                </svg>
              </div>
            </th>
            <th>Адрес</th>
            <th>Заявитель</th>
            <th>Описание</th>
            <th>Срок</th>
            <th>
              <div>
                Статус
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_972_101"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                  >
                    <rect width="16" height="16" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_972_101)">
                    <path
                      d="M7.33333 12V5.86668L4.93333 8.26668L4 7.33334L8 3.33334L12 7.33334L11.0667 8.26668L8.66667 5.86668V12H7.33333Z"
                      fill="#CCCCCC"
                    />
                  </g>
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="id">390</span></td>
            <td>17.04.2024</td>
            <td>Лесная, 10, кв. 5</td>
            <td>Забавкин А.П.</td>
            <td>Подкрасить царапины на стенах в гостиной.</td>
            <td>24.04.2024 10:00</td>
            <td>Новая</td>
          </tr>
        </tbody>
      </table>
      <div class="footer-pagination">
        <div class="footer-pagination__counter">
          <p><strong>1–10</strong> из <strong>1500</strong> записей</p>
          <select aria-label="Количество записей на странице">
            <option>10</option>
            <option>15</option>
          </select>
        </div>
      </div>
    </div>
    <Modal v-if="showModal" @close="showModal = !showModal"></Modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Modal from "@/components/Modal.vue";
export default {
  name: "HomeView",
  data() {
    return {
      filters: {
        search: "",
        premise: "",
      },
      showModal: false,
    };
  },
  components: {
    Modal,
  },
  created() {
    this.fetchOrders();
  },
  computed: {
    ...mapGetters(["orders"]),
  },
  methods: {
    ...mapActions(["fetchOrders", "fetchPremises", "fetchApartments"]),
  },
};
</script>
<style lang="scss">
.home {
  .table {
    height: 100vh;
    border-radius: 8px;
    background: #ffffff;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .table__navigate-btn {
    text-align: right;
    button {
      cursor: pointer;
      box-shadow: 0 4px 4px 0 #6aae5e40;
      border: none;
      padding: 7px 16px;
      background: #50b053;
      border-radius: 2px;
      color: #ffffff;
      font-size: 10px;
      font-weight: 400;
    }
  }

  input {
    outline: none;
  }

  select {
    outline: none;
  }

  .table__filter-block {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    align-items: center;
    width: 100%;
    .search-container {
      position: relative;
      width: 50%;
    }
    .search-container input {
      width: 100%;
      border: none;
      border-bottom: solid #cccccc 1px;
      padding-bottom: 17px;
      display: flex;
    }
    .search-container input::placeholder {
      color: #999999;
      font-size: 14px;
      font-weight: 400;
    }
    .search-container .search-icon {
      position: absolute;
      right: 12px;
      top: 0;
      font-size: 18px;
      color: #aaa;
    }
    select {
      width: 50%;
    }
  }

  select {
    border: none;
    border-bottom: solid #cccccc 1px;
    padding-bottom: 17px;
    color: #999999;
    font-size: 14px;
    font-weight: 400;
    position: relative;
  }

  option {
    height: 50px;
    border-radius: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
  }

  .styled-table thead tr {
    text-align: left;
  }

  .styled-table th,
  .styled-table td {
    padding: 19px 8px;
    border-bottom: 1px solid #ddd;
  }

  .styled-table th {
    font-size: 14px;
    font-weight: 400;
    color: #50b053;
    div {
      display: flex;
      align-items: center;
      gap: 8px;
      svg {
        cursor: pointer;
      }
    }
  }

  .styled-table td {
    font-size: 14px;
    color: #333;
  }

  .styled-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .styled-table .id {
    background-color: #50b053;
    color: #fff;
    padding: 4px 14px;
    border-radius: 5px;
    font-weight: 400;
    font-size: 14px;
  }

  .footer-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    select {
      width: 90px;
      padding-bottom: 8px;
    }
    .footer-pagination__counter {
      p {
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }
      display: flex;
      align-items: start;
      gap: 20px;
    }
  }
}
</style>
