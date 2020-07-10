import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import useThemeContext from '@theme/hooks/useThemeContext'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

const features = [
  {
    title: <>Works by itself</>,
    imageUrl: 'img/works-by-itself-feature-illustration.svg',
    description: <>The Provider has it's own Context. No need to create one or connect to redux just for translate your app (but you can, if you want).</>
  },
  {
    title: <>Automagic</>,
    imageUrl: 'img/automagic-feature-illustration.svg',
    description: <>The Babel and Webpack plugins extracts your variables, injects the translations file and makes sure everything is in sync, always.</>
  },
  {
    title: <>Simple</>,
    imageUrl: 'img/simple-feature-illustration.svg',
    description: (
      <>
        No need to import a translations JSON, merge locales files or anything. Just setup the provider with the initial locale and start building your app
        naturally!
      </>
    )
  }
]

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 className="text--center">{title}</h3>
      <p className="text--center">{description}</p>
    </div>
  )
}

function Header() {
  const context = useDocusaurusContext()
  const { siteConfig = {}, isClient } = context
  const { isDarkTheme } = useThemeContext()
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={clsx(styles.square, isDarkTheme && styles.skeuShadowDark, styles.skeuShadow)}>
          <img key={isClient} src={useBaseUrl(isDarkTheme ? 'img/logo-dark.svg' : 'img/logo-light.svg')} alt="Mercurio" />
        </div>
        {isDarkTheme ? 'Daaaark' : 'Liiight'}
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p>A simple React component to make your apps reach all ears (or eyes).</p>
        <div className={styles.buttons}>
          <Link key={isClient} className={clsx(styles.button, isDarkTheme && styles.skeuShadowDark, styles.skeuShadow)} to={useBaseUrl('docs/')}>
            GET STARTED
          </Link>
        </div>
      </div>
    </header>
  )
}

function Explanation() {
  const { isClient } = useDocusaurusContext()
  const { isDarkTheme } = useThemeContext()
  return (
    <section className="text--center">
      <h3>Like magic, but it's not</h3>
      <img key={isClient} src={useBaseUrl(isDarkTheme ? 'img/explanation-dark.svg' : 'img/explanation-light.svg')} alt="Mercurio" />
    </section>
  )
}

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  const { isDarkTheme } = useThemeContext()

  return (
    <Layout title={`${siteConfig.title}`} description="Lo and behold, listen to what Mercurio told!">
      <Header />
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <Explanation />
      </main>
    </Layout>
  )
}

export default Home
