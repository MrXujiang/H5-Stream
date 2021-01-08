import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  memo,
} from 'react';
import { Button, Input, Popover, Modal, Tooltip, message } from 'antd';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DeleteOutlined,
  AuditOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Color from '@/core/FormComponents/Color';
import { uuid, serverUrl } from '@/utils/tool';
import Logo from '@/assets/logo.svg';

import styles from './index.less';

const { TextArea } = Input;

const HeaderComponent = memo(props => {
  const {
    pointData,
    clearData,
    location,
    importTpl,
    addUserPage,
    modePageConfig,
    pageConfig,
  } = props;
  const [pageConfVisible, setPageConfVisible] = useState(false);
  const selectRef = useRef(null);

  const nickname = localStorage.getItem('nickname');

  const config = {
    title: 'dooring温馨提示',
    content: <div>新建页面前是否保存已有更改？</div>,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      addUserPage && addUserPage(pointData);
      clearData && clearData();
      history.push(`/editor?tid=${uuid(8, 16)}`);
    },
    onCancel() {
      console.log('cancel');
    },
  };

  const toPreview = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData));
    if (nickname) {
      savePreview();
      setTimeout(() => {
        window.open(
          `${serverUrl}/h5_plus/preview?tid=${props.location.query.tid}`,
        );
      }, 500);
    } else {
      message.info('预览前为了保障用户数据不丢失, 所以请先登录');
    }
  };

  const content = () => {
    const { tid } = location.query || '';
    const sid = nickname;
    const rp = localStorage.getItem('rp');
    if (sid && rp) {
      return (
        <QRCode
          value={`${window.location.protocol}//${window.location.host}/h5_plus/preview?tid=${tid}`}
        />
      );
    }
    return (
      <div style={{ color: 'gray' }}>
        为了保障用户数据安全,请先
        <a href="/login" target="_blank">
          登录
        </a>
      </div>
    );
  };

  const pageConfigData = { ...pageConfig };

  const handlePageChange = (v, key) => {
    if (key === 'remove') {
      delete pageConfigData['bgImage'];
    } else {
      pageConfigData[key] = v;
    }
  };

  const handlePageSubmit = () => {
    setPageConfVisible(false);
    modePageConfig && modePageConfig(pageConfigData);
  };

  const pageConfigView = useCallback(() => {
    return (
      <div className={styles.pageConfig}>
        <div className={styles.formControl}>
          <span className={styles.label}>标题(必填):</span>
          <Input
            defaultValue={pageConfig.title}
            placeholder="请输入页面标题"
            onChange={e => handlePageChange(e.target.value, 'title')}
          />
        </div>
        <div className={styles.formControl}>
          <span className={styles.label}>描述:</span>
          <TextArea
            defaultValue={pageConfig.desc}
            placeholder="请输入页面描述"
            onChange={e => handlePageChange(e.target.value, 'desc')}
          />
        </div>
        <div className={styles.formControl}>
          <span className={styles.label}>背景色:</span>
          <Color
            value={pageConfig.bgColor || 'rgba(255,255,255,1)'}
            onChange={v => handlePageChange(v, 'bgColor')}
          />
        </div>
        <div className={styles.formControl}>
          <span className={styles.label}></span>
          <Button
            type="primary"
            style={{ marginRight: '20px' }}
            onClick={handlePageSubmit}
            block
          >
            保存
          </Button>
        </div>
      </div>
    );
  }, [pageConfig]);

  const handleSelectChange = v => {
    selectRef.current = v;
  };

  const downLoadJson = () => {
    const json = pointData.map(v => ({
      ...v,
      item: {
        config: v.item.config,
        h: v.item.h,
        type: v.item.type,
        category: v.item.category,
      },
    }));
    const config = { tpl: json, pageConfig };
    const jsonStr = JSON.stringify(config);
    const blob = new Blob([jsonStr], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'template.json');
  };

  const toLogin = () => {
    let prevPath = encodeURI(
      `${window.location.pathname}${window.location.search}`,
    );
    window.location.href = `/h5_plus/login?redirect=${prevPath}`;
  };

  const toBack = () => {
    const { tid } = props.location.query || '';
    history.push({
      pathname: '/',
      query: {
        tid,
      },
    });
  };

  const savePreview = () => {
    const { tid } = props.location.query || '';
  };

  const savePage = () => {};

  const newPage = () => {
    Modal.confirm(config);
  };

  const deleteAll = () => {
    Modal.confirm({
      title: '确认清空画布?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        clearData();
      },
    });
  };

  const uploadprops = useMemo(
    () => ({
      name: 'file',
      showUploadList: false,
      beforeUpload(file, fileList) {
        // 解析并提取json数据
        let reader = new FileReader();
        reader.onload = function(e) {
          let data = e.target.result;
          importTpl && importTpl(JSON.parse(data));
        };
        reader.readAsText(file);
      },
    }),
    [],
  );

  return (
    <div className={styles.header}>
      <div className={styles.logoArea}>
        <div className={styles.backBtn} onClick={toBack}>
          <ArrowLeftOutlined />
        </div>
        <div className={styles.logo} title="Dooring">
          <a href={`${serverUrl}/h5_visible`}>
            <img src={Logo} alt="Dooring-强大的h5编辑器" />
          </a>
        </div>
      </div>
      <div className={styles.controlArea}>
        <Tooltip placement="bottom" title="新建页面">
          <Button
            type="link"
            style={{ marginRight: '6px' }}
            title="新建页面"
            onClick={newPage}
          >
            <FileAddOutlined />
          </Button>
        </Tooltip>

        <Tooltip placement="bottom" title="下载json文件">
          <Button
            type="link"
            style={{ marginRight: '6px' }}
            title="下载json文件"
            onClick={downLoadJson}
            disabled={!pointData.length}
          >
            <CopyOutlined />
          </Button>
        </Tooltip>

        <Tooltip placement="bottom" title="清空">
          <Button
            type="link"
            style={{ marginRight: '6px' }}
            title="清空"
            onClick={deleteAll}
            disabled={!pointData.length}
          >
            <DeleteOutlined />
          </Button>
        </Tooltip>

        <Button
          type="link"
          style={{ marginRight: '6px' }}
          onClick={toPreview}
          disabled={!pointData.length}
          title="预览"
        >
          预览
        </Button>
      </div>
      <div className={styles.btnArea}>
        <Popover
          placement="bottom"
          title="页面配置"
          content={pageConfigView}
          trigger="click"
          visible={pageConfVisible}
          onVisibleChange={v => setPageConfVisible(v)}
        >
          <Button type="primary" ghost style={{ marginRight: '12px' }}>
            <AuditOutlined />
            页面设置
          </Button>
        </Popover>
      </div>
    </div>
  );
});

export default HeaderComponent;
