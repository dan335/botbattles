import Head from 'next/head';
import '../node_modules/normalize.css/normalize.css';
import ReactGA from 'react-ga';



export default class MainLayout extends React.Component {

  componentDidMount() {
    ReactGA.initialize('UA-82312326-11');
    ReactGA.pageview(window.location.pathname + window.location.search);
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

          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <div>
          {children}
        </div>
        {/* <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
        <style jsx global>{`
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Audiowide', sans-serif;
            background-color: hsl(203, 30%, 15%);
            color: hsl(203, 0%, 90%);
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
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
