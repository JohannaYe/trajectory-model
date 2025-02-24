// import React, { useState, useEffect } from 'react';
// import MapComponent from '../components/Map/modelMapComponent';
// import ChatSection from '../components/ChatSection';
// import { touristTrajectories, getTrajectoryForMap } from '../data/sampleTrajectory';
// import { Input, Button, Select, Card, Spin } from 'antd';
// import styled from 'styled-components';
// import dayjs from 'dayjs';
// import { PauseOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';

// const { Option } = Select;

// // 样式组件
// const PageContainer = styled.div`
//   padding: 20px;
//   max-width: 1400px;
//   margin: 0 auto; // 居中整个容器
// `;

// const PageTitle = styled.h1`
//   text-align: center;
//   margin-bottom: 24px;
// `;

// const ContentLayout = styled.div`
//   display: flex;
//   gap: 20px;
//   margin-top: 20px;
//   height: calc(100vh - 140px);

//   @media (max-width: 768px) {
//     flex-direction: column;
//     height: auto;
//   }
// `;

// const MapContainer = styled.div`
//   width: 100%;
//   height: 100%; // 使用100%高度
//   position: relative;
//   border-radius: 8px;
//   overflow: hidden;
// `;

// const MapSection = styled.div`
//   flex: 2;
//   height: 100%;
//   min-height: 500px;
//   position: relative;

//   @media (max-width: 768px) {
//     height: 50vh;
//   }
// `;

// const MapLegend = styled.div`
//   position: absolute;
//   left: 20px;
//   bottom: 80px;
//   background: rgba(255, 255, 255, 0.9);
//   padding: 12px;
//   border-radius: 8px;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   z-index: 1000;
// `;

// const LegendItem = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 8px 0;
//   font-size: 14px;

//   &:before {
//     content: '';
//     display: inline-block;
//     width: 20px;
//     height: 3px;
//     margin-right: 8px;
//     background: ${props => props.color || '#1890ff'};
//   }
// `;

// const LoadingOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(255, 255, 255, 0.8);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1001;
// `;

// const TimeDisplay = styled.div`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   background: rgba(255, 255, 255, 0.9);
//   padding: 8px 16px;
//   border-radius: 4px;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   z-index: 1000;
// `;

// const ControlPanel = styled.div`
//   position: absolute;
//   bottom: 20px;
//   left: 50%;
//   transform: translateX(-50%);
//   background: rgba(255, 255, 255, 0.9);
//   padding: 8px 16px;
//   border-radius: 4px;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   z-index: 1000;
//   display: flex;
//   gap: 10px;
// `;

// const CardTitle = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const QueryControls = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   margin-bottom: 16px;
//   flex-wrap: wrap;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: stretch;
//   }
// `;

// // 添加类型定义
// interface TrajectoryPoint {
//   lng: number;
//   lat: number;
//   timestamp: string;
//   location?: string;
//   duration?: number;
// }

// interface TouristTrajectory {
//     type: string;
//     trajectories: Array<Array<TrajectoryPoint>>;
// }

// interface TouristTrajectories {
//     [key: string]: TouristTrajectory;
// }

// const ModelingPage = () => {
//     const [selectedTouristType, setSelectedTouristType] = useState<string>('');
//     const [currentPointIndex, setCurrentPointIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentTime, setCurrentTime] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [selectedLocation, setSelectedLocation] = useState<TrajectoryPoint | undefined>();

//     // 安全地获取轨迹点
//     const trajectoryPoints = selectedTouristType && touristTrajectories[selectedTouristType]?.trajectoryPoints || [];

//     // 添加数据加载效果
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setIsLoading(false);
//         }, 1500);
//         return () => clearTimeout(timer);
//     }, [selectedTouristType]);

//     // 优化动画效果
//     useEffect(() => {
//         let timer;
//         if (isPlaying && currentPointIndex < trajectoryPoints.length) {
//             timer = setInterval(() => {
//                 setCurrentPointIndex(prev => {
//                     if (prev < trajectoryPoints.length - 1) {
//                         const nextPoint = trajectoryPoints[prev + 1];
//                         // 根据点之间的距离动态调整动画速度
//                         const distance = calculateDistance(
//                             trajectoryPoints[prev].coordinates,
//                             nextPoint.coordinates
//                         );
//                         const speed = Math.max(500, Math.min(2000, distance * 200)); // 根据距离调整速度

//                         setCurrentTime(dayjs(nextPoint.timestamp).format('YYYY-MM-DD HH:mm:ss'));

//                         // 设置下一个定时器的间隔
//                         if (timer) {
//                             clearInterval(timer);
//                             timer = setInterval(() => {
//                                 setCurrentPointIndex(p => p + 1);
//                             }, speed);
//                         }

//                         return prev + 1;
//                     } else {
//                         setIsPlaying(false);
//                         return prev;
//                     }
//                 });
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [isPlaying, currentPointIndex, trajectoryPoints]);

//     // 计算两点之间的距离
//     const calculateDistance = (point1: number[], point2: number[]) => {
//         const [lng1, lat1] = point1;
//         const [lng2, lat2] = point2;
//         return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
//     };

//     // 重置动画
//     const handleReset = () => {
//         setCurrentPointIndex(0);
//         setIsPlaying(false);
//         setCurrentTime(dayjs(trajectoryPoints[0].timestamp).format('YYYY-MM-DD HH:mm:ss'));
//     };

//     // 播放/暂停动画
//     const togglePlay = () => {
//         if (!isPlaying && currentPointIndex === trajectoryPoints.length - 1) {
//             handleReset();
//         }
//         setIsPlaying(!isPlaying);
//     };

//     // 获取当前轨迹数据
//     const getCurrentTrajectory = () => {
//         if (!selectedTouristType || !touristTrajectories[selectedTouristType]) {
//             return [];
//         }
//         return touristTrajectories[selectedTouristType]?.trajectories || [];
//     };

//     // 处理游客类型改变
//     const handleTouristTypeChange = (value: string) => {
//         setSelectedTouristType(value);
//         setSelectedLocation(undefined); // 重置选中的位置
//         setCurrentPointIndex(0); // 重置点索引
//         setIsPlaying(false); // 停止播放

//         // 设置初始时间
//         const points = touristTrajectories[value]?.trajectoryPoints || [];
//         if (points.length > 0) {
//             setCurrentTime(dayjs(points[0].timestamp).format('YYYY-MM-DD HH:mm:ss'));
//         }
//     };

//     // 处理地图点击事件
//     const handleLocationClick = (point: TrajectoryPoint) => {
//         setSelectedLocation(point);
//     };

//     return (
//         <PageContainer>
//             <PageTitle>游客轨迹建模与AI分析</PageTitle>

//             <QueryControls>
//                 <Select
//                     value={selectedTouristType}
//                     onChange={handleTouristTypeChange}
//                     style={{ width: 200 }}
//                     placeholder="请选择游客类型"
//                 >
//                     {Object.keys(touristTrajectories).map(type => (
//                         <Option key={type} value={type}>
//                             {touristTrajectories[type].type}
//                         </Option>
//                     ))}
//                 </Select>
//                 <Button 
//                     type="primary" 
//                     onClick={() => setIsLoading(true)}
//                     loading={isLoading}
//                     disabled={!selectedTouristType}
//                 >
//                     应用筛选
//                 </Button>
//             </QueryControls>

//             <ContentLayout>
//                 <MapSection>
//                     <Card bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }}>
//                         <MapContainer>
//                             {isLoading && (
//                                 <LoadingOverlay>
//                                     <Spin size="large" tip="正在加载轨迹数据..." />
//                                 </LoadingOverlay>
//                             )}

//                             <TimeDisplay>
//                                 {currentTime || (trajectoryPoints.length > 0 
//                                     ? dayjs(trajectoryPoints[0].timestamp).format('YYYY-MM-DD HH:mm:ss')
//                                     : '未选择时间')}
//                             </TimeDisplay>

//                             <MapComponent
//                                 trajectories={getCurrentTrajectory()}
//                                 onLocationClick={handleLocationClick}
//                             />

//                             <MapLegend>
//                                 <h4>图例说明</h4>
//                                 <LegendItem color="#1890ff">历史轨迹</LegendItem>
//                                 <LegendItem color="#f5222d">当前位置</LegendItem>
//                                 <LegendItem color="#52c41a">景点位置</LegendItem>
//                             </MapLegend>

//                             <ControlPanel>
//                                 <Button
//                                     type="primary"
//                                     onClick={togglePlay}
//                                     icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
//                                     disabled={!selectedTouristType || trajectoryPoints.length === 0}
//                                 >
//                                     {isPlaying ? '暂停' : '播放'}
//                                 </Button>
//                                 <Button
//                                     onClick={handleReset}
//                                     icon={<ReloadOutlined />}
//                                     disabled={!selectedTouristType || trajectoryPoints.length === 0}
//                                 >
//                                     重置
//                                 </Button>
//                             </ControlPanel>
//                         </MapContainer>
//                     </Card>
//                 </MapSection>

//                 <ChatSection 
//                     style={{ flex: 1, height: '100%' }}
//                     selectedTouristType={selectedTouristType}
//                     currentTrajectory={getCurrentTrajectory()[0]} // 传递当前轨迹
//                     selectedLocation={selectedLocation}
//                 /> 
//             </ContentLayout>
//         </PageContainer>
//     );
// };

// export default ModelingPage;
import React, { useState } from 'react';
import MapComponent from '../components/Map/modelMapComponent';
import styled from 'styled-components';
import { Select } from 'antd';

const { Option } = Select;

// 基础样式组件
const PageContainer = styled.div`
  padding: 20px;
`;

const ControlContainer = styled.div`
  margin-bottom: 20px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
`;

// 简化的示例数据
const trajectoryOptions = {
    tourist1: {
        name: '游客路线A',
        color: '#1890ff', // 蓝色
        data: [
            {
                lng: 118.0615,
                lat: 24.4475,
                timestamp: '2024-03-21 09:00:00',
                location: ' 鼓浪屿天主堂 '
            },
            {
                lng: 118.0625,
                lat: 24.4465,
                timestamp: '2024-03-21 10:30:00',
                location: ' 故宫鼓浪屿外国文物馆 '
            },
            {
                lng: 118.0640,
                lat: 24.4455,
                timestamp: '2024-03-21 12:00:00',
                location: ' 日光岩寺 '
            },
            {
                lng: 118.0655,
                lat: 24.4445,
                timestamp: '2024-03-21 13:30:00',
                location: ' 港仔后沙滩 '
            },
            {
                lng: 118.0670,
                lat: 24.4435,
                timestamp: '2024-03-21 15:00:00',
                location: ' 观海园 '
            },
            {
                lng: 118.0660,
                lat: 24.4425,
                timestamp: '2024-03-21 16:30:00',
                location: ' 黄家花园 '
            },
            {
                lng: 118.0635,
                lat: 24.4430,
                timestamp: '2024-03-21 18:00:00',
                location: ' 龙头路商业街（购买纪念品）'
            }
        ]
    },
    tourist2: {
        name: '游客路线B',
        color: '#722ed1', // 紫色
        data: [
            {
                lng: 118.0638,
                lat: 24.4445,
                timestamp: '2024-03-21 09:00:00',
                location: ' 海天堂构 '
            },
            {
                lng: 118.0645,
                lat: 24.4440,
                timestamp: '2024-03-21 10:45:00',
                location: ' 黄荣远堂 '
            },
            {
                lng: 118.0655,
                lat: 24.4450,
                timestamp: '2024-03-21 12:30:00',
                location: ' 大德记浴场 '
            },
            {
                lng: 118.0670,
                lat: 24.4460,
                timestamp: '2024-03-21 14:00:00',
                location: ' 汇丰银行公馆旧址 '
            },
            {
                lng: 118.0660,
                lat: 24.4470,
                timestamp: '2024-03-21 15:30:00',
                location: ' 鼓浪屿音乐厅 '
            },
            {
                lng: 118.0640,
                lat: 24.4480,
                timestamp: '2024-03-21 17:00:00',
                location: ' 毓园 '
            },
            {
                lng: 118.0620,
                lat: 24.4490,
                timestamp: '2024-03-21 18:30:00',
                location: ' 龙头路美食街（享用晚餐）'
            }
        ]
    }
};


const ModelingPage = () => {
    const [selectedTrajectory, setSelectedTrajectory] = useState<string>('');

    const getCurrentTrajectory = () => {
        if (!selectedTrajectory) return [];
        return [[...trajectoryOptions[selectedTrajectory].data]];
    };

    const getCurrentColor = () => {
        if (!selectedTrajectory) return '#1890ff';
        return trajectoryOptions[selectedTrajectory].color;
    };

    return (
        <PageContainer>
            <ControlContainer>
                <Select
                    style={{ width: 200 }}
                    placeholder="请选择轨迹"
                    value={selectedTrajectory}
                    onChange={setSelectedTrajectory}
                >
                    {Object.entries(trajectoryOptions).map(([key, value]) => (
                        <Option key={key} value={key}>{value.name}</Option>
                    ))}
                </Select>
            </ControlContainer>
            <MapContainer>
                <MapComponent
                    trajectories={getCurrentTrajectory()}
                    pathColor={getCurrentColor()}
                />
            </MapContainer>
        </PageContainer>
    );
};

export default ModelingPage;