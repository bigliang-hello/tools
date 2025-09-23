import { Swiper, SwiperItem, View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

const Home = () => {
    const data: CategoryType[] = [
        {
            type: 'category',
            image: '../../resources/meituan.png',
            name: '美团外卖券',
            tag: 'meituan'
        },
        {
            type: 'category',
            image: '../../resources/eleme.png',
            name: '饿了么券',
            tag: 'eleme'
        },
        {
            type: 'category',
            image: '../../resources/jingdong.png',
            name: '京东外卖券',
            tag: 'jd'
        },
        {
            type: 'category',
            image: '../../resources/touxiangguanli.png',
            name: '丑头像生成器',
            tag: 'uglyAvatar'
        },
        {
            type: 'category',
            image: '../../resources/touxiangguanli.png',
            name: '大转盘',
            tag: 'whell'
        },

    ];

    const handleClick = (tag: string) => {
        if (tag === 'whell') {
            Taro.navigateTo({
                url: '/pages/wheel/index'
            })
        } else if (tag === 'uglyAvatar') {
            Taro.navigateTo({
                url: '/pages/uglyAvatar/index'
            })
        }
    }

    return (
        <View className={styles.homePage}>
            <Swiper
                className={styles.homeSwiper}
                indicatorColor='#999'
                indicatorActiveColor='#333'
                circular
                indicatorDots
                autoplay>
                <SwiperItem>
                    <>1</>
                </SwiperItem>
                <SwiperItem>
                    <>2</>
                </SwiperItem>
                <SwiperItem>
                    <>3</>
                </SwiperItem>
            </Swiper>
            <View className={styles.categoryTitle}>
                <Text>Category</Text>
            </View>
            <View className={styles.gridContainer}>
                {
                    data.map((item, _) => (
                        <View
                            key={item.tag}
                            className={styles.gridItem}
                            onClick={() => handleClick(item.tag)}
                        >
                            <Image src={item.image} className={styles.avatar} />
                            <Text>{item.name}</Text>
                        </View>
                    ))
                }
            </View>
        </View>

    )
}

export default Home