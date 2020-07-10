module.exports = {
  title: 'Mercurio',
  tagline: 'Lo and behold, listen to what Mercurio told!',
  url: 'https://mercurio.marcossi.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'MarcossiDesign', // Usually your GitHub org/user name.
  projectName: 'mercurio-lives', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Mercurio',
      logo: {
        alt: 'Mercurio',
        src: 'img/logo-light.svg',
        srcDark: 'img/logo-dark.svg'
      },
      links: [
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/MarcossiDesign/mercurio-lives',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Installation',
              to: 'docs/installation',
            },
            {
              label: 'Usage',
              to: 'docs/usage',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Marcossi Design',
              to: 'https://marcossi.com/en',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MarcossiDesign/mercurio-lives',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marcossi Design, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'installation',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/MarcossiDesign/mercurio-lives/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
