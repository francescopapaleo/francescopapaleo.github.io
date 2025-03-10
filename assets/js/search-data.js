// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-projects",
    title: "projects",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-about",
          title: "about",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/about/";
          },
        },{id: "post-sparse-thoughts-in-the-latent-space",
      
        title: 'Sparse Thoughts in the Latent Space <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@francescopapaleo/sparse-thoughts-in-the-latent-space-1463b1156407?source=rss-3c7b514a84d5------2", "_blank");
        
      },
    },{id: "projects-bvio",
          title: 'BVIO',
          description: "DJ set and music installation.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/bvio/";
            },},{id: "projects-concrete-bologna-elettroacustica",
          title: 'Concrete Bologna Elettroacustica',
          description: "Electro-acoustic and acousmatic music collective.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/concrete/";
            },},{id: "projects-fuck-war",
          title: 'Fuck War',
          description: "Music for the Call for Artist.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fuckwar/";
            },},{id: "projects-non-vengo-dalla-luna",
          title: 'Non Vengo dalla Luna',
          description: "Theater performance.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/nvdl/";
            },},{id: "projects-oh-theladystone",
          title: 'oh!theladystone',
          description: "Indietronica band.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/otls/";
            },},{id: "projects-neural-audio-spring-reverb",
          title: 'Neural Audio Spring Reverb',
          description: "Audio plugin and research paper for DAFx 2024",
          section: "Projects",handler: () => {
              window.location.href = "/projects/springreverb/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%66%72%61%6E%63%65%73%63%6F.%70%61%70%61%6C%65%6F@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/francescopapaleo", "_blank");
        },
      },{
        id: 'social-instagram',
        title: 'Instagram',
        section: 'Socials',
        handler: () => {
          window.open("https://instagram.com/francesco.papaleo.music", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/francescopapaleo", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Socials',
        handler: () => {
          window.open("https://medium.com/@francescopapaleo", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0003-7903-0201", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=sTf2rzcAAAAJ&hl", "_blank");
        },
      },{
        id: 'social-soundcloud_username',
        title: 'Soundcloud_username',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
