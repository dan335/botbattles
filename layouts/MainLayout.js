import Head from 'next/head';
import '../node_modules/normalize.css/normalize.css';
import ReactGA from 'react-ga';
import * as Cookies from 'js-cookie';



export default class MainLayout extends React.Component {

  componentDidMount() {
    ReactGA.initialize('UA-82312326-11');
    ReactGA.pageview(window.location.pathname + window.location.search);

    if (document.referrer && document.referrer.includes('crazygames')) {
      Cookies.set('isCrazyGames', true);
    }
  }

  redBg() {
    return (
      <style jsx global>{`
        body {
          background-color: #160305;
        }
      `}</style>
    )
  }

  blueBg() {
    return (
      <style jsx global>{`
        body {
          background-color: hsl(203, 30%, 15%);
        }
      `}</style>
    )
  }

  render() {
    const {headerData, children} = this.props;

    return (
      <div>
        <Head>
          <title>BotBattles.io</title>
          <meta name="description" content="BotBattles.io is a free io multiplayer online robotic combat battle royale unblocked arena game." />
          <link href="https://fonts.googleapis.com/css?family=Audiowide" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=0.6" />

          <meta property="og:image" content="https://botbattles.io/static/botbattlesThumb.jpg" />

          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />

          <script>
        	var aiptag = aiptag || new Object();
        	aiptag.cmd = aiptag.cmd || [];
        	aiptag.cmd.display = aiptag.cmd.display || [];
        	// Show GDPR consent tool
        	aiptag.gdprShowConsentTool = true;
        	// If you use your own GDPR consent tool please set aiptag.gdprConsent = false; if an EU user has declined or not yet accepted marketing cookies, for users outside the EU or for users that accepted the GDPR please use aiptag.gdprConsent = true;

        	</script>
        	<script async src="//api.adinplay.com/libs/aiptag/pub/IGZ/botbattles.io/tag.min.js"></script>
        </Head>
        {this.props.bgColor == 'red' ? this.redBg() : this.blueBg()}
        <div>
          {children}
        </div>
        {/* <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
        <style jsx global>{`
          .contentContainer {
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            background-color: hsla(203, 30%, 10%, 95%);
            padding: 12px;
            border-radius: 3px;
            margin-top: 20px;
            margin-bottom: 100px;
          }

          @media only screen and (max-width:900px) {
            .contentContainer {
              width: auto;
            }
          }

          @media only screen and (min-width: 1200px) {
            .contentContainer {
              width: 1200px;
            }
          }

          .contentBox {
            background-color: hsl(203, 30%, 20%);
            border-radius: 3px;
            padding: 20px;
            margin-bottom: 5px;
          }
          .roboto {
            font-family: 'Roboto', sans-serif;
          }
          .audiowide {
              font-family: 'Audiowide', sans-serif;
          }
          .green {
            color: #91df3e;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Audiowide', sans-serif;
            color: hsl(203, 0%, 95%);
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background: url("/static/botbattlesPainting.jpg") no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
          }
          a {
            color: hsl(203, 75%, 60%);
            text-decoration: none;
          }
          a:hover {
            color: hsl(89, 75%, 65%);
            text-decoration: none;
          }
          textarea:focus, input:focus, select:focus {
            outline: none;
          }
          input:not([type='submit']), textarea {
            border: 0;
            padding: 8px;
            border-radius: 2px;
            width: 100%;
            font-family: 'Roboto', sans-serif;
            background-color: hsl(203, 0%, 90%);
          }
          select {
            font-family: 'Roboto', sans-serif;
            background-color: hsl(203, 0%, 90%);
          }
          button,.btn {
            border: 0;
            padding: 6px 10px 6px 10px;
            border-radius: 2px;
            background-color: hsl(203, 40%, 40%);
            color: hsl(89, 5%, 92%);
            display: inline-block;
            margin-right: 4px;
            font-size: 90%;
          }
          button:focus,.btn:focus {
            outline:0;
          }
          button:hover,.btn:hover {
            background-color: hsl(89, 55%, 40%);
            cursor: pointer;
          }
          button.selected,.btn.selected {
            background-color: hsl(89, 55%, 40%);
          }
          button.selected.noHover:hover,.btn.selected.noHover:hover {
            cursor: default;
            background-color: hsl(213, 60%, 40%) ;
          }
          button.stackable {
            margin-bottom: 4px;
          }
          button:disabled, button[disabled] {
            background-color: hsl(213, 60%, 85%);
            cursor: not-allowed;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
        `}</style>
      </div>
    )
  }
}
