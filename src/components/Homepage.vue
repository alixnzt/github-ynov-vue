<template>
  <div>
    <nav class="navbar sticky-top navbar-light bg-light justify-content-between">
      <a class="navbar-brand">Github vue</a>
      <form>
        <datepicker placeholder="Date début" v-model="dateBegin" :format="formatDate"></datepicker>
        <datepicker placeholder="Date fin" v-model="dateEnd" :format="formatDate" ></datepicker>
        <multiselect v-model="selectedRepos" 
                      :options="repoItems" 
                      :multiple="true" 
                      :close-on-select="false"
                      :clear-on-select="false" 
                      :preserve-search="true"
                      placeholder="Selectionner repertoire" 
                      label="full_name" 
                      track-by="full_name" 
                      :preselect-first="true">   
        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
          v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
        </template>
        </multiselect>
        <button type="button" class="btn btn-primary" v-on:click="getCommitsForSelectedRepos()">Rechercher</button>
      </form>
    </nav>

    <div>
      <div class="container" style="padding-top: 10px;">
        <h1 style="padding-top: 50px;">Liste des commits</h1>
        <div>
            <div class="card" v-for="selectedRepo in selectedRepos">
              <div class="card-body" style="padding-top: 10px;">
                    <h5 class="card-title">{{selectedRepo.owner.login}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{selectedRepo.name}}</h6>
                    <p class="card-text" v-for="commit in commits">{{commit.commit.message}} - ({{formatDate(commit.commit.author.date)}})</p>
                </div>
            </div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
//imports
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import Vue2Filters from 'vue2-filters'

export default {
  name: "Homepage",
  components: {
    Multiselect,
    Datepicker,
    Vue2Filters,
  },
  props: {
    token : `token d3db3b8367c18ddac1d3f72c31a80fc37d6c31de`,
  },
  data() {
    return {
      repoItems: [],
      selectedRepos: [],

      dateBegin:'',
      dateEnd:'',
      dateCommit:'',

      commits: [],

      //localDatas
      localAccounts: [
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
      localRepositories: [
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
      localCommits: [
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
  created(){
    this.getReposList();
  },
  methods: {
    getReposList(){
      var vm = this;
      axios({
        method:'get',
        url:'https://api.github.com/search/repositories?q=github-ynov-vue',
        responseType:'stream',
        headers: {'Authorization': vm.token }
      })
        .then(function(response) {
          response.data.items.map(function(value, key) {
            vm.repoItems.push(value);
          });
          // console.log(vm.repoItems);
        })
    },
    formatDate(date) {
        return moment(date).format('YYYY-MM-D à h:mm:ss');
    },
    getCommitsForSelectedRepos(){
      var vm = this;

      vm.selectedRepos.forEach((repo) => {
        vm.commits = []
        axios({
          method:'get',
          url: repo.url + "/commits",
          responseType:'stream',
          headers: {'Authorization': vm.token }
        })
          .then(function(response) {
            response.data.forEach((commit) => {
              vm.dateCommit = new Date(commit.commit.author.date)
              if(vm.dateCommit >= vm.dateBegin && vm.dateCommit <= vm.dateEnd){
                vm.commits.push(commit);
              }
            })
          })
      })
    },
  },
};
</script>

<style scoped>
</style>
