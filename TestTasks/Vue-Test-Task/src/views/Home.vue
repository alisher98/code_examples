<template lang="pug">
  .home
    img.home__img(:src="Logo")
    .home__search
      input.home__search__input(autocomplete=false ref="searchField" @input="sendRequest" v-model="searchValue" placeholder="Search jokes..." border="0" maxlength=120)
      .home__search__info_message(v-if="!isLoading" :class="{ 'home__search__info_message--error': errorMessage }")
        | {{ infoMessage || errorMessage }}
      img.home__search__loading(v-if="isLoading" :src="Loading")
    .jokes
      JokeCard(v-for="joke in jokes" :joke="joke" :key="joke.id")
</template>

<script>

import { mapActions, mapState } from 'vuex';
import JokeCard from '@/components/JokeCard.vue';
import Loading from '@/assets/gif/loading.gif';
import Logo from '@/assets/img/main_logo.png';

export default {
  name: 'Home',
  components: {
    JokeCard,
  },
  data () {
    return {
      Logo,
      Loading,
      searchValue: '',
      errorMessage: '',
      infoMessage: '',
      debounce: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapState(['jokes']),
  },
  watch: {
  },
  mounted () {
    window.addEventListener('focus', this.inputFocus);
    this.inputFocus();
  },
  beforeDestroy () {
    window.removeEventListener('focus', this.inputFocus);
  },
  methods: {
    ...mapActions(['fetchJokes']),
    inputFocus () {
      if (this.$refs.searchField && this.$refs.searchField.focus) {
        this.$refs.searchField.focus();
      }
    },
    sendRequest () {
      if (this.debounce) clearTimeout(this.debounce);
      if (this.searchValue.length > 3) {
        this.debounce = setTimeout(() => {
          this.errorMessage = '';
          this.infoMessage = '';
          this.isLoading = true;
          this.fetchJokes({ query: this.searchValue })
            .then(() => {
              this.infoMessage = `Found jokes: ${this.jokes.length}`;
            })
            .catch(err => {
              if (err.response && err.response.data && err.response.data.violations) {
                this.errorMessage = err.response.data.violations['search.query'] || 'Ошибка';
              } else {
                this.errorMessage = err.message;
              }
            }).finally(() => {
              this.isLoading = false;
            });
        }, 2000);
      } else {
        this.infoMessage = '';
        this.errorMessage = 'Минимальное количество символов 4';
      }
    },
  },
};
</script>
<style lang="scss">

.home {
  width: 100%;
  height: 100%;

  &__img {
    display: block;
    width: 30%;
    height: auto;
    min-width: 310px;
    margin: 0 auto;
  }

  &__search {
    position: relative;
    width: 32%;
    min-width: 310px;
    margin: 0 auto;
    display: inline-block;

    &__info_message {
      margin: 30px 0 50px;
      font-size: 12px;
      text-align: center;
      min-height: 20px;

      &--error {
        color: red;
        text-transform: uppercase;
      }
    }

    &__input {
      box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
      padding: 0 50px 0 30px;
      box-sizing: border-box;
      width: 100%;
      height: 64px;
      font-weight: bold;
      font-size: 22px;
      line-height: 26px;
      color: #656EC2;
      border: none;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #656EC2;
      }
    }

    &__loading {
      &, img {
        width: auto;
        height: 64px;
      }
    }
  }
}
</style>
