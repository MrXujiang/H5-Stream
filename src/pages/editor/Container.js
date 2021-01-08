import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Result, Tabs } from 'antd';
import {
  HighlightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import HeaderComponent from './components/Header';
import SourceBox from './SourceBox';
import TargetBox from './TargetBox';
import DynamicEngine from '@/core/DynamicEngine';
import FormEditor from '@/core/FormRender';
import schema from 'components/BasicShop/schema';
import { overSave, uuid } from '@/utils/tool';

import styles from './index.less';

const { TabPane } = Tabs;

const Container = props => {
  const [rightColla, setRightColla] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const [pointData, setPointdata] = useState(
    JSON.parse(localStorage.getItem('userData') || '[]'),
  );
  const [pageConfig, setPageConfig] = useState(
    localStorage.getItem('pageConfig') || '{}',
  );
  const [curPoint, setCurPoint] = useState(null);
  const [userPages, setUserPages] = useState([]);
  // 指定画布的id
  let canvasId = 'js_canvas';

  const CpIcon = {
    base: <HighlightOutlined />,
  };

  const generateHeader = (type, text) => {
    return (
      <div className={styles.iconWrap}>
        {CpIcon[type]}
        <div style={{ display: 'block' }}>{text}</div>
      </div>
    );
  };

  const handleFormSave = useCallback(
    data => {
      modPointData({ ...curPoint, item: { ...curPoint.item, config: data } });
    },
    [curPoint],
  );

  const clearData = useCallback(() => {
    overSave('userData', []);
    overSave('pageConfig', {});
    setPointdata([]);
    setCurPoint(null);
  }, []);

  const changeRightColla = useMemo(() => {
    return c => {
      setRightColla(c);
    };
  }, []);

  useEffect(() => {
    if (curPoint && curPoint.status === 'inToCanvas') {
      setRightColla(false);
    }
  }, [curPoint]);

  const allType = useMemo(() => {
    return Object.keys(schema);
  }, []);

  const getCateTpl = useCallback(cate => {
    return Object.values(schema).filter(item => item.category === cate);
  }, []);

  const ref = useRef(null);
  const renderRight = useMemo(() => {
    return (
      <div
        ref={ref}
        className={styles.attrSetting}
        style={{
          transition: 'all ease-in-out 0.5s',
          transform: rightColla ? 'translate(100%,0)' : 'translate(0,0)',
        }}
      >
        {pointData.length && curPoint ? (
          <FormEditor
            config={curPoint.item.editableEl}
            uid={curPoint.id}
            defaultValue={curPoint.item.config}
            onSave={handleFormSave}
            rightPannelRef={ref}
          />
        ) : (
          <div style={{ paddingTop: '100px' }}>
            <Result
              status="404"
              title="还没有数据哦"
              subTitle="赶快拖拽组件来生成你的H5页面吧～"
            />
          </div>
        )}
      </div>
    );
  }, [
    pointData.length,
    curPoint,
    // handleDel,
    handleFormSave,
    pointData.length,
    rightColla,
  ]);

  const changeCollapse = useMemo(() => {
    return c => {
      setCollapsed(c);
    };
  }, []);

  const tabRender = useMemo(() => {
    if (collapsed) {
      return (
        <>
          <TabPane tab={generateHeader('base', '')} key="1"></TabPane>
        </>
      );
    } else {
      return (
        <>
          <TabPane tab={generateHeader('base', '基础')} key="1">
            <div className={styles.ctitle}>基础组件</div>
            {getCateTpl('base').map((value, i) => {
              return (
                <TargetBox item={value} key={i} canvasId={canvasId}>
                  <DynamicEngine
                    {...value}
                    config={schema[value.type].config}
                    componentsType="base"
                    isTpl={true}
                  />
                </TargetBox>
              );
            })}
          </TabPane>
        </>
      );
    }
  }, [canvasId, collapsed, generateHeader, schema]);

  const modPointData = payload => {
    const { id } = payload;
    const newPointData = pointData.map(item => {
      if (item.id === id) {
        return payload;
      }
      return { ...item };
    });
    overSave('userData', newPointData);
    // 组装editableEl
    const { config, h, type, category } = payload.item;
    const editableEl = schema[type].editData;

    setPointdata(newPointData);
    setCurPoint({
      ...payload,
      item: { config, h, type, category, editableEl },
    });
  };

  const onCurPointClick = payload => {
    // 组装editableEl
    const { config, h, type, category } = payload.item;
    const editableEl = schema[type].editData;

    setCurPoint({
      ...payload,
      item: { config, h, type, category, editableEl },
    });
  };

  const modPageConfig = useCallback(payload => {
    overSave('pageConfig', payload);
    setPageConfig(payload);
  }, []);

  const addPointData = useCallback(
    payload => {
      let newPointData = [...pointData, payload];
      overSave('userData', newPointData);
      // 组装editableEl
      const { config, h, type, category } = payload.item;
      const editableEl = schema[type].editData;
      setPointdata(newPointData);
      setCurPoint({
        ...payload,
        item: { config, h, type, category, editableEl },
      });
    },
    [pointData, curPoint],
  );

  const changePointData = useCallback(payload => {
    let newPointData = [...payload];
    overSave('userData', newPointData);
    setPointdata(newPointData);
  }, []);

  const delPointData = payload => {
    const { id } = payload;
    const newPointData = pointData.filter(item => item.id !== id);
    overSave('userData', newPointData);
    setPointdata(newPointData);
    setCurPoint(null);
  };

  const copyPointData = useCallback(
    payload => {
      // 复制逻辑
    },
    [pointData],
  );

  const addUserPage = useCallback(payload => {
    let newUserPages = [...userPages, payload];
    overSave('userPages', newUserPages);
    setUserPages(newUserPages);
    setPointdata([]);
  }, []);

  const importTpl = payload => {
    const { pageConfig, tpl } = payload;
    overSave('userData', tpl);
    overSave('pageConfig', pageConfig || {});
    setPointdata(tpl);
    setPageConfig(pageConfig);
    setCurPoint(null);
  };

  return (
    <div className={styles.editorWrap}>
      <HeaderComponent
        pointData={pointData}
        clearData={clearData}
        location={props.location}
        importTpl={importTpl}
        addUserPage={addUserPage}
        pageConfig={pageConfig}
        modePageConfig={modPageConfig}
      />
      <div className={styles.container}>
        <div
          className={styles.list}
          style={{
            transition: 'all ease-in-out 0.5s',
            position: 'fixed',
            width: collapsed ? '60px' : '350px',
            overflow: 'hidden',
            zIndex: 200,
            boxShadow: 'none',
          }}
        >
          <div className={styles.componentList}>
            <Tabs
              className="editorTabclass"
              defaultActiveKey="1"
              tabPosition={'left'}
            >
              {tabRender}
            </Tabs>
          </div>
          <div
            className={styles.collapsed}
            style={{ position: 'absolute', bottom: '100px', left: '25px' }}
            onClick={() => changeCollapse(!collapsed)}
          >
            {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          </div>
        </div>
        <div
          style={{
            width: collapsed ? '60px' : '350px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>
        <div className={styles.tickMark}>
          <SourceBox
            canvasId={canvasId}
            allType={allType}
            pointData={pointData}
            curPoint={curPoint}
            pageConfig={pageConfig}
            addPointData={addPointData}
            copyPointData={copyPointData}
            delPointData={delPointData}
            modPointData={modPointData}
            changePointData={changePointData}
            onCurPointClick={onCurPointClick}
          />
        </div>
        {renderRight}
        <div
          className={styles.rightcolla}
          style={{
            position: 'absolute',
            right: rightColla ? 0 : '304px',
            transform: 'translate(0,-50%)',
            transition: 'all ease-in-out 0.5s',
          }}
          onClick={() => changeRightColla(!rightColla)}
        >
          {!rightColla ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </div>
        <div
          style={{
            width: rightColla ? 0 : '304px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Container;
