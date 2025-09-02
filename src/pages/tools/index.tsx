import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const Tools = () => {
  return (
    <View className={styles.toolsContainer}>
      <Text className={styles.toolsTitle}>工具</Text>
      <View className={styles.toolsContent}>
        <Text>这里是工具页面的内容</Text>
      </View>
    </View>
  )
}

export default Tools