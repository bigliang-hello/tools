import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtTabBar, AtButton } from 'taro-ui'
import styles from './index.module.scss'
import Home from '../home'

const Index = () => {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    // componentDidMount 逻辑
    return () => {
      // componentWillUnmount 逻辑
    }
  }, [])

  const handleChange = (value: number) => {
    setCurrent(value)
  }

  // 渲染不同页面内容
  const renderContent = () => {
    switch (current) {
      case 0:
        return (
          <Home />
        )
      case 1:
        return (
          <View className={styles.profilePage}>
            <Text className={styles.pageTitle}>我的</Text>
            <Text>这是个人中心页面</Text>
            <AtButton type='secondary'>个人设置</AtButton>
          </View>
        )
      default:
        return (
          <View className={styles.defaultPage}>
            <Text>页面不存在</Text>
          </View>
        )
    }
  }

  return (
    <>
      <View className={styles.pageContent}>
        {renderContent()}
      </View>
      <AtTabBar 
        fixed 
        iconSize={20} 
        fontSize={16} 
        current={current} 
        onClick={handleChange} 
        tabList={[
          {
            title: '首页', 
            iconType: 'home'
          },
          {
            title: '我的', 
            iconType: 'user'
          },
        ]}
      />
    </>
  )
}

export default Index
