import { dynamic } from 'umi';
import Loading from '@/components/LoadingCp';
import { useMemo, memo, FC } from 'react';
import React from 'react';

export type componentsType = 'base';

const DynamicFunc = (type: any, componentsType: componentsType) =>
  dynamic({
    loader: async function() {
      let Component: FC<{ isTpl: boolean }>;
      if (componentsType === 'base') {
        const { default: Graph } = await import(
          `@/components/BasicShop/BasicComponents/${type}`
        );
        Component = Graph;
      }
      return (props: DynamicType) => {
        const { config, isTpl } = props;
        return <Component {...config} isTpl={isTpl} />;
      };
    },
    loading: () => (
      <div style={{ paddingTop: 10, textAlign: 'center' }}>
        <Loading />
      </div>
    ),
  });

type DynamicType = {
  isTpl: boolean;
  config: { [key: string]: any };
  type: any;
  componentsType: componentsType;
  category: componentsType;
};
const DynamicEngine = memo((props: DynamicType) => {
  const { type, config, category } = props;
  const Dynamic = useMemo(() => {
    return (DynamicFunc(type, category) as unknown) as FC<DynamicType>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, config]);

  return <Dynamic {...props} />;
});

export default DynamicEngine;
