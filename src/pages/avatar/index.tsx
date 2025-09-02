import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Avatar from 'boring-avatars';

const AvatarGenerator = () => {
  // 默认颜色组合
  const defaultColors = ["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]
  
  // 状态管理
  const [colors, setColors] = useState(defaultColors)
  const [variant, setVariant] = useState('beam')
  const [name, setName] = useState('John Doe')
  const [size, setSize] = useState(120)
  
  // 预设颜色组合
  const colorSets = [
    ["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"], // 默认
    ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6'], // 明亮
    ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9'], // 深色
    ['#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58', '#556270'], // 柔和
    ['#1A535C', '#4ECDC4', '#F7FFF7', '#FF6B6B', '#FFE66D'], // 清新
  ]
  
  // 头像变体选项
  const variants = ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus']
  
  // 保存头像
  const saveAvatar = () => {
    // 获取SVG元素
    const svgElement = document.querySelector('.avatarContainer svg') as SVGSVGElement
    
    if (svgElement) {
      try {
        // 将SVG转换为字符串
        const svgString = new XMLSerializer().serializeToString(svgElement)
        
        // 创建Blob
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        
        // 创建下载链接
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${name}-avatar.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        Taro.showToast({
          title: '头像已保存',
          icon: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error('保存头像失败:', error)
        Taro.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        })
      }
    } else {
      Taro.showToast({
        title: '未找到头像元素',
        icon: 'error',
        duration: 2000
      })
    }
  }
  
  // 随机生成名称
  const generateRandomName = () => {
    const names = ['Alex Smith', 'Taylor Johnson', 'Jordan Lee', 'Casey Brown', 'Morgan Wilson']
    const randomIndex = Math.floor(Math.random() * names.length)
    setName(names[randomIndex])
  }
  
  return (
    <View className={styles.container}>
      <Text className={styles.title}>头像生成器</Text>
      
      <View className={`${styles.avatarContainer} avatarContainer`}>
        <Avatar
          size={size}
          name={name}
          variant={variant as any}
          colors={colors}
        />
      </View>
      
      <View className={styles.controlSection}>
        <Text className={styles.sectionTitle}>名称</Text>
        <View className={styles.nameControl}>
          <Text className={styles.currentName}>{name}</Text>
          <Button className={styles.randomButton} onClick={generateRandomName}>随机名称</Button>
        </View>
      </View>
      
      <View className={styles.controlSection}>
        <Text className={styles.sectionTitle}>变体样式</Text>
        <View className={styles.variantOptions}>
          {variants.map((v) => (
            <Button 
              key={v} 
              className={`${styles.variantButton} ${variant === v ? styles.activeVariant : ''}`}
              onClick={() => setVariant(v)}
            >
              {v}
            </Button>
          ))}
        </View>
      </View>
      
      <View className={styles.controlSection}>
        <Text className={styles.sectionTitle}>颜色组合</Text>
        <View className={styles.colorOptions}>
          {colorSets.map((colorSet, index) => (
            <View 
              key={index} 
              className={`${styles.colorSet} ${colors === colorSet ? styles.activeColorSet : ''}`}
              onClick={() => setColors(colorSet)}
            >
              {colorSet.map((color, i) => (
                <View 
                  key={i} 
                  className={styles.colorSample} 
                  style={{ backgroundColor: color }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      
      <Button className={styles.saveButton} onClick={saveAvatar}>保存头像</Button>
    </View>
  )
}

export default AvatarGenerator