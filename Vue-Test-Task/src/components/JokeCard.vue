<template lang="pug">
  .joke_card(@click="goToUrl")
    .joke_card__icon
      img(src="https://api.chucknorris.io/img/favicon.ico" alt="joke_icon")
    .joke_card__text {{ joke.value }}
    .joke_card__hash {{ joke.id }}
    .joke_card__date {{ formatDate(joke.updated_at) }}
</template>

<script>

export default {
  name: 'JokeCard',
  props: {
    joke: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      iconUrl: null,
    };
  },
  mounted () {
    // this.checkIcon();
  },
  methods: {
    goToUrl () {
      window.location.href = this.joke.url;
      // window.open(this.joke.url, '_blank');
    },
    formatDate (date) {
      let initDate = new Date(date);
      if (initDate) {
        return `${('0' + initDate.getDate()).slice(-2)}.${('0' + (initDate.getMonth() + 1)).slice(-2)}.${initDate.getFullYear()}`;
      }
      return date;
    },
    // checkIcon () {
    //   this.$http.get(this.joke.icon_url).then(() => {
    //     this.iconUrl = this.joke.iconUrl;
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // },
  },

};
</script>
<style scoped lang="scss">
  .joke_card {
    display: inline-block;
    max-width: 45%;
    min-width: 310px;
    box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
    vertical-align: middle;
    margin: 10px;
    padding: 20px 50px;
    box-sizing: border-box;
    text-align: left;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
      box-shadow: 4px 4px 8px 0 rgba(0, 128, 255, 0.2);
    }
    &__icon {
      img {
        width: 100%;
        height: auto;
      }
      display: inline-block;
      width: 30px;
      height: 30px;
    }
    &__text {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      flex: 1 0 30%;
      min-height: 50px;
    }
    &__hash {
      font-family: Montserrat,sans-serif;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #767676;
      display: inline-block;
      min-width: 50%;
      margin-top: 20px;
    }
    &__date {
      margin-top: 20px;
      color: #767676;
      font-family: Montserrat,sans-serif;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      display: inline-block;
      width: 50%;
      text-align: right;
      float: right;
    }
  }
</style>
