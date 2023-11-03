/*
 * @Description: 悬浮按钮
 * @Version: 2.0
 * @Author: 白雾茫茫丶
 * @Date: 2023-11-02 09:07:36
 * @LastEditors: 白雾茫茫丶
 * @LastEditTime: 2023-11-03 09:59:51
 */
import { ClearOutlined, SettingOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks'
import { Card, Drawer, Flex, FloatButton, Image, Popconfirm, Space, Switch, Typography } from 'antd'
import { concat, eq, filter, includes, map } from 'lodash-es'
import { FC, useState } from 'react'

import { LOCAL_KEY } from '@/enums'
import type { HotListConfig, HotTypes } from '@/types'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils'

import { hotDataSource } from '../HotContainer/config'
import ThemeIcon from './ThemeIcon';

const { Text } = Typography

type ActionButtonsProps = {
  setHotConfig: (value: HotListConfig[]) => void;
  filterHiddenHot: () => HotListConfig[];
}

const ActionButtons: FC<ActionButtonsProps> = ({ setHotConfig, filterHiddenHot }) => {
  // 受控展开，需配合 trigger 一起使用
  const [open, setOpen] = useState<boolean>(false)
  // 抽屉
  const [showDrawer, { setTrue: setDrawerTrue, setFalse: setDrawerFalse }] = useBoolean(false);
  /**
   * @description: 重置数据
   */
  const resetConfig = () => {
    localStorage.clear();
    window.location.reload();
  }

  /**
   * @description: 切换热榜回调
   */
  const onChangeHotShow = (checked: boolean, value: HotTypes) => {
    // 不显示的榜单列表
    const hiddenHotList = getLocalStorageItem<HotTypes[]>(LOCAL_KEY.HOTHIDDEN) || [];
    // true 从列表移除，否则加入列表
    const result = checked ? filter(hiddenHotList, (item: HotTypes) => !eq(item, value)) : concat(hiddenHotList, value)
    setLocalStorageItem(LOCAL_KEY.HOTHIDDEN, result)
    setHotConfig(filterHiddenHot())
  }
  /**
   * @description: 渲染显示设置
   */
  const renderShowSwitch = () => {
    // 不显示的榜单列表
    const hiddenHotList = getLocalStorageItem<HotTypes[]>(LOCAL_KEY.HOTHIDDEN) || [];
    return (
      <Flex justify='space-around' align="center" gap="small" wrap="wrap">
        {
          map(hotDataSource, ({ value, label }: HotListConfig) => (
            <Card bodyStyle={{ width: 200 }} key={value}>
              <Flex justify="space-between" align="center">
                <Space align='center'>
                  <Image src={`/${value}.svg`} alt={label} width={20} height={20} preview={false} />
                  <Text>{label}</Text>
                </Space>
                <Switch
                  disabled={filterHiddenHot().length <= 1 && !includes(hiddenHotList, value)}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  onChange={(checked) => onChangeHotShow(checked, value)}
                  checked={!includes(hiddenHotList, value)}
                />
              </Flex>
            </Card>
          ))
        }
      </Flex>
    )
  }
  return (
    <>
      <FloatButton.Group
        open={open}
        icon={<ThemeIcon />}
        trigger="click"
        onOpenChange={(open) => setOpen(open)}>
        {/* 重置配置 */}
        <Popconfirm
          title="温馨提醒"
          description="此操作会丢失你的所有自定义设置?"
          onConfirm={resetConfig}
        >
          <FloatButton
            icon={<ClearOutlined />}
            tooltip='重置配置'
          />
        </Popconfirm>
        {/* 热榜显示设置 */}
        <FloatButton
          icon={<SettingOutlined />}
          tooltip='热榜显示设置'
          onClick={() => setDrawerTrue()}
        />
        {/* 回到顶部 */}
        <FloatButton.BackTop visibilityHeight={100} tooltip='回到顶部' />
      </FloatButton.Group>
      {/* 抽屉 */}
      <Drawer title="热榜显示设置" open={showDrawer} onClose={() => setDrawerFalse()} width={500}>
        {renderShowSwitch()}
      </Drawer>
    </>
  )
}
export default ActionButtons