import { FC } from 'react';
import Head from 'next/head';

interface IAppHeadProps {
  title?: string;
  description?: string;
}

const AppHead: FC<IAppHeadProps> = ({ 
  title = 'ROM – Real Estate, Properties & Homes',
  description = 'Find verified properties, homes and real estate deals with ROM – your trusted real estate partner.'
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default AppHead;
