import React from 'react';
import { Helmet } from 'react-helmet-async';

type Props = {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  twitterHandle?: string;
  jsonLd?: object | null;
};

export const PageHead: React.FC<Props> = ({ title, description, url, image, twitterHandle, jsonLd }) => {
  const canonical = url || (typeof window !== 'undefined' ? window.location.href : undefined);
  const desc = description || 'Autospark — Premium car showroom and services in Rajshahi, Bangladesh.';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Minimal structured data when provided */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default PageHead;
