import React, { memo } from 'react';
import DynamicEngine from '@/core/DynamicEngine';
import styles from './viewRender.less';

interface PointDataItem {
  id: string;
  item: Record<string, any>;
  point: Record<string, any>;
}

interface ViewProps {
  pointData: Array<PointDataItem>;
  pageData?: any;
  width?: number;
}

const ViewRender = memo((props: ViewProps) => {
  const { pointData, pageData } = props;

  return (
    <div
      style={{
        backgroundColor: pageData && pageData.bgColor,
        backgroundImage:
          pageData && pageData.bgImage
            ? `url(${pageData.bgImage[0].url})`
            : 'initial',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {pointData.map((value: PointDataItem) => (
        <div key={value.id} data-grid={value.point} className={styles.dragItem}>
          <DynamicEngine {...(value.item as any)} isTpl={false} />
        </div>
      ))}
    </div>
  );
});

export default ViewRender;
