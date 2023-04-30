import { FC, useEffect, useState } from 'react';

import { useLazyGetSummaryQuery } from '../services/article';
import { copy, linkIcon, loader, tick } from '../assets/images';

interface Article {
  url: string;
  summary: string;
}

interface DemoProps {}

const Demo: FC<DemoProps> = ({}) => {
  const [article, setArticle] = useState<Article>({
    url: '',
    summary: '',
  });

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    if (!localStorage.getItem('articles')) {
      return;
    }

    const allAvailableArticlesString = JSON.parse(
      localStorage.getItem('articles') || ''
    );

    if (allAvailableArticlesString) {
      setAllArticles(allAvailableArticlesString as Article[]);
    }
  }, []);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url, length: 3 });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      setArticle(newArticle);

      const updatedAllArticles = [...allArticles, newArticle];
      setAllArticles(updatedAllArticles);

      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  };

  const copyHandler = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setCopied('');
    }, 2000);
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='Link Icon'
            className='absolute left-0 my-2 ml-3 w-5'
          />
          <input
            type='url'
            className='url_input peer'
            placeholder='Enter a URL'
            value={article.url}
            onChange={(e: any) => {
              setArticle((value) => ({ ...value, url: e.target.value }));
            }}
            required
          />

          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
          >
            <p>↵</p>
          </button>
        </form>

        {/* Display all summarized articles */}

        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div
              key={`line-${index}`}
              className='link_card'
              onClick={() => setArticle(item)}
            >
              <div className='copy_btn' onClick={() => copyHandler(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt='Copy Icon'
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display summary  */}

      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img
            src={loader}
            alt='Loader Icon'
            className='w-20 h-20 object-contain'
          />
        ) : error ? (
          <p className='text-sm font-inter font-bold text-black text-center'>
            Something went wrong while summarizing the article. Please try again
            later...
          </p>
        ) : article.summary ? (
          <div className='flex flex-col gap-3'>
            <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
              Article <span className='blue_gradient'>Summary</span>
            </h2>
            <div className='summary_box'>
              <p className='font-inter font-medium text-sm text-gray-700'>
                {article.summary}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Demo;
