<template>
  <div>
    <nav class="navbar sticky-top navbar-light bg-light justify-content-between">
      <a class="navbar-brand">Github vue</a>
      <form>
        <a type="button" class="btn btn-primary" data-toggle="modal" data-target="#projectModal">
          Projet
        </a>
        <input type="text"/>
        <a type="button" class="btn btn-primary" data-toggle="modal" data-target="#dateModal">
          Période
        </a>
        <select class="js-example-basic-multiple" name="accounts[]" multiple="multiple" style="width:150px;">
          <option v-for="account in accounts" :key="account.id" value="account.login">{{account.login}}</option>
        </select>
        <button type="button" class="btn btn-primary">Search</button>
      </form>
    </nav>

    <div>
      <!-- <datedate-picker i18n="EN" @selected="events">datepicker</date-picker> -->

      <div class="container">
        <h1 style="padding-top: 50px;">Liste des commits</h1>

        <table class="table">
  <thead>
    <tr>
      <th scope="col">Commit name</th>
      <th scope="col">Login name</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="commit in commits" :key="commit.commit.committer.date">
      <td>{{commit.commit.message}}</td>
      <td>{{commit.commit.committer.name}}</td>
      <td>{{commit.commit.committer.date}}</td>
    </tr>
  </tbody>
</table>
      </div>

    </div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  name: "Homepage",
  props: {},
  data() {
    return {
      repositories: [],
      accounts: [
        {
          id: 0,
          login: 'alixnzt',
        },
        {
          id: 1,
          login: 'mrolland'
        },
        {
          id: 2,
          login: 'xfidelo',
        },
        {
          id: 3,
          login: 'gegeblc',
        },
      ],
      repositories: [
        {
          id: 0,
          name: 'github-ynov-vue',
          commits_url: '',
          owner: {
            id: 0,
            login:'alixnzt'
          }
        },
        {
          id: 1,
          name: 'github-ynov-vue',
          commits_url: '',
          owner: {
            id: 1,
            login:'mael61'
          }
        },
        {
          id: 2,
          name: 'github-ynov-vue',
          commits_url: '',
          owner: {
            id: 2,
            login:'mrolland'
          }
        },
      ],

      commits: [
        {
          commit: {
            committer: {
              name: 'alixnzt',
              date: '2018-10-19T08:08:20Z'
            },
            id:'0',
            message: 'Initialisation projet',
          }
        },
        {
          commit: {
            committer: {
              name: 'alixnzt',
              date: '2018-10-19T09:00:00Z'
            },
            id:'1',
            message: 'Commit 1',
          }
        },
        {
          commit: {
            committer: {
              name: 'alixnzt',
              date: '2018-10-19T09:15:00Z'
            },
            id:'2',
            message: 'Commit 2',
          }
        },
        {
          commit: {
            committer: {
              name: 'mael61',
              date: '2018-10-19T10:08:20Z'
            },
            id:'3',
            message: 'Initialisation projet',
          }
        },
        {
          commit: {
            committer: {
              name: 'mael61',
              date: '2018-10-19T08:08:10Z'
            },
            id:'4',
            message: 'Commit 1',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T11:08:00Z'
            },
            id:'5',
            message: 'Initialisation projet',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T12:08:00Z'
            },
            id:'6',
            message: 'Commit 1',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T13:08:00Z'
            },
            id:'7',
            message: 'Commit 2',
          }
        },
        {
          commit: {
            committer: {
              name: 'mrolland',
              date: '2018-10-19T14:20:00Z'
            },
            id:'8',
            message: 'Commit 3',
          }
        },
      ],
    }
  },
  beforeMount(){
    this.getRepositoriesList();
  },
  methods: {
    getRepositoriesList(){
      axios({
        method:'get',
        url:'https://api.github.com/search/repositories?q=github-ynov-vue',
        responseType:'stream',
        headers: {'Authorization': `token d3db3b8367c18ddac1d3f72c31a80fc37d6c31de` }
      })
        // .then(function (response) {
        //   console.log(response.data.items);
        // });
        .then(response => {
          console.log(response.data.items);
          this.repositories.push(response.data.items);
          console.log(this.repositories);
        })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
