const ProfileExperienceComponent = {
    template: '#profile-tab-experience-template'
};

const ProfileEducationComponent = {
    template: '#profile-tab-education-template'
};

const ProfileCertificationComponent = {
    template: '#profile-tab-certification-template'
};

const ProfileBlogComponent = {
    template: '#profile-tab-blog-template',
};

const ProfileCardComponent = {
    data() {
        return {
            name: '',
            avatar_url: '',
            linkedin_url: '',
            github_url: ''
        }
    },
    template: '#profile-card-template',
};

const ProfileTabComponent = {
    components: {
        'profile-tab-experience': ProfileExperienceComponent,
        'profile-tab-education': ProfileEducationComponent,
        'profile-tab-certification': ProfileCertificationComponent,
        'profile-tab-blog': ProfileBlogComponent
    },
    template: '#profile-tab-template'
};

const RootComponent = {
    components: {
        'profile-card': ProfileCardComponent,
        'profile-tab': ProfileTabComponent
    }
    
};

const app = Vue.createApp(RootComponent);
app.mount('#app');