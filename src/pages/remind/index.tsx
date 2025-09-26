import { View, Text, Input, Switch, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

const RemindPage = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState('2025-09-26');
  const [repeat, setRepeat] = useState('每月(每月的26号)');
  const [endRepeat, setEndRepeat] = useState('永不结束');
  const [remindTime, setRemindTime] = useState('当天10:00');

  const handleCreateTask = () => {
    // 在这里处理创建任务的逻辑
    console.log({
      taskName,
      taskDesc,
      isAllDay,
      startDate,
      repeat,
      endRepeat,
      remindTime,
    });
    Taro.showToast({
      title: '任务已创建',
      icon: 'success',
      duration: 2000
    });
  };

  return (
    <View className='remind-container'>
      <View className='form-item'>
        <Text className='form-label'>任务名称</Text>
        <Input
          className='form-input'
          placeholder='请输入任务名称'
          value={taskName}
          onInput={(e) => setTaskName(e.detail.value)}
        />
      </View>
      <View className='form-item'>
        <Text className='form-label'>任务图标</Text>
        <View className='form-value'>
          <Text>〉</Text>
        </View>
      </View>
      <View className='form-item'>
        <Text className='form-label'>任务描述</Text>
        <Input
          className='form-input'
          placeholder='任务描述(可选)'
          value={taskDesc}
          onInput={(e) => setTaskDesc(e.detail.value)}
        />
      </View>

      <View className='form-section'>
        <View className='form-item'>
          <Text className='form-label'>全天事件</Text>
          <Switch checked={isAllDay} onChange={(e) => setIsAllDay(e.detail.value)} />
        </View>
        <View className='form-item'>
          <Text className='form-label'>开始时间</Text>
          <View className='form-value'>
            <Text>{startDate} 星期五 〉</Text>
          </View>
        </View>
      </View>

      <View className='form-section'>
        <View className='form-item'>
          <Text className='form-label'>重复</Text>
          <View className='form-value'>
            <Text>{repeat} 〉</Text>
          </View>
        </View>
        <View className='form-item'>
          <Text className='form-label'>结束重复</Text>
          <View className='form-value'>
            <Text>{endRepeat} 〉</Text>
          </View>
        </View>
      </View>

      <View className='form-section'>
        <View className='form-item'>
          <Text className='form-label'>提醒</Text>
          <View className='form-value'>
            <Text>{remindTime} 〉</Text>
          </View>
        </View>
      </View>
      
      <View className='reminder-info'>
        <Text>① 每次签到会为你申请微信提醒,坚持签到,才会稳定通知哦~</Text>
      </View>

      <View className='footer'>
        <Button className='create-button' onClick={handleCreateTask}>新建任务</Button>
      </View>
    </View>
  );
};

export default RemindPage;