import Head from 'next/head';
import {T} from "components/T";
import {Container} from "react-bootstrap";
import withAppContext from "lib/withAppContext";

export default function Home() {
  return (
    <>
      <Head>
          <title>Motogym online</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Online competitions, championships and various trials on MotoGymkhana" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
      </Head>
        <Container className='h-100 text-center pt-5'>
            <h1>Motogym online</h1>
            <br/>
            <br/>
            <h4><T>Take part in various online competitions</T></h4>
            <h4><T>Collect your own stats</T></h4>
            <h4><T>Keep track of your progress and the progress of rivals and friends</T></h4>
        </Container>
    </>
  );
}

export const getServerSideProps = withAppContext();