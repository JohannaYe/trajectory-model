import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from 'antd';
import styled from '@emotion/styled';
import OpenAI from "openai";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SendOutlined } from '@ant-design/icons';

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
const { TextArea } = Input;

// 修改主容器样式，增加空白区域
const StyledChatSection = styled.div`
//   padding: 40px 20px;
  width: 800px;  // 改为固定宽度
  height: calc(100vh - 100px);
  margin: 0 auto;
  position: relative; // 添加相对定位
  flex-shrink: 0;    // 防止压缩
`;

// 优化卡片样式
const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 0;
  border: none;
  background: #ffffff;
  width: 100%;      // 确保卡片填满容器
  flex-shrink: 0;   // 防止压缩
`;

// 优化头部样式
const CardHeader = styled.div`
  background: linear-gradient(135deg, #1890ff, #096dd9);
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 1.2em;
`;

const CardBody = styled.div`
  padding: 20px;
  width: 100%;      // 确保内容区域填满卡片
`;

const ChatHistoryContainer = styled.div`
  max-height: 400px;
  min-height: 200px;
  overflow-y: auto;
  margin: 20px 0;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;      // 确保聊天历史区域宽度固定
  margin: 0 auto;
`;

// 消息容器也需要考虑固定宽度
const MessageContainer = styled.div<{ type: string }>`
  margin: 15px 0;
  padding: 5px 20px;
  border-radius: 20px;
  max-width: 70%;   // 保持最大宽度比例
  width: fit-content; // 根据内容自适应宽度
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  ${props => props.type === 'user' ? `
    background: linear-gradient(135deg, #95f6ff, #96efff);
    margin-left: auto;
    color: #333;
  ` : `
    background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
    margin-right: auto;
    color: #333;
  `}
`;

// 输入区域也需要固定宽度
const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  align-items: flex-start;
  width: 100%;      // 确保输入区域宽度固定
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid #e6e8eb;
  padding: 12px 16px;
  font-size: 1.05em;
  resize: none;
  transition: all 0.3s ease;

  &:hover, &:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }

  &::placeholder {
    color: #8c8c8c;
  }
`;

// 优化发送按钮样式
const SendButton = styled(Button)`
  height: auto;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1.05em;
  font-weight: 500;
  background: linear-gradient(135deg, #1890ff, #096dd9);
  border: none;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    background: linear-gradient(135deg, #40a9ff, #1890ff);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuggestedQuestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
`;

// 优化建议问题卡片样式
const StyledQuestionCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  cursor: pointer;
  flex: 1;
  min-width: 200px;
  max-width: calc(33% - 16px);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #f8f9fa;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    border-color: #40a9ff;
    background: white;
  }

  .ant-card-body {
    padding: 16px 20px;
    font-size: 1.05em;
    color: #333;
  }
`;

// 将 WelcomeMessage 组件的定义移到 ChatSection 组件之前
const WelcomeMessageContainer = styled.div`
  text-align: center;
  margin: 24px 0 32px;
  color: #333;

  h3 {
    font-size: 1.6em;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #1890ff, #096dd9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1em;
    line-height: 1.6;
    color: #666;
    margin: 8px 0;
  }
`;

const WelcomeMessage = () => (
  <WelcomeMessageContainer>
    <h3>欢迎使用AI助手！</h3>
    <p>
      您好！我是您的鼓浪屿AI助手，旨在帮助您解答景区问题、提供信息和完成各种任务。
      您可以随时输入您的问题或请求，我会尽快回复您。
    </p>
  </WelcomeMessageContainer>
);

// 添加默认问题列表
const defaultQuestions = [
    "🏖️ 鼓浪屿有哪些必去景点？",
    "🍜 推荐几个特色美食店铺",
    "🚶‍♂️ 建议的游览路线是什么？",
    "🎵 鼓浪屿的音乐文化特色",
    "📸 最佳拍照打卡地点",
    "🏛️ 鼓浪屿的历史建筑介绍"
];

interface ChatSectionProps {
  selectedTouristType?: string;
  currentTrajectory?: Array<TrajectoryPoint>;
  selectedLocation?: TrajectoryPoint;
}

const ChatSection: React.FC<ChatSectionProps> = ({ 
  selectedTouristType, 
  currentTrajectory,
  selectedLocation 
}) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  // 处理位置相关的上下文
  useEffect(() => {
    if (selectedLocation) {
      const locationContext = `用户当前查看的位置：
      - 经度：${selectedLocation.lng}
      - 纬度：${selectedLocation.lat}
      - 时间：${selectedLocation.timestamp}
      ${selectedLocation.location ? `- 地点：${selectedLocation.location}` : ''}`;

      setChatHistory(prev => [...prev, {
        type: 'system',
        content: `系统提示：您正在查看 ${selectedLocation.location || '某个位置'} 附近。您可以询问这个位置附近的景点、美食或其他信息。`
      }]);
    }
  }, [selectedLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserInput(e.target.value);
  };

  const sendMessageToAI = async (message: string) => {
    try {
      setIsLoading(true);
      
      // 构建上下文信息
      const contextMessage = `
        用户类型：${selectedTouristType || '普通游客'}
        ${selectedLocation ? `
        当前位置：${selectedLocation.location || '未知位置'}
        时间：${selectedLocation.timestamp}
        ` : ''}
      `;

      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "你是鼓浪屿旅游咨询助手。" + contextMessage 
          },
          { role: "user", content: message }
        ],
        model: "deepseek-chat",
      });

      const aiResponse = completion.choices[0].message.content || "抱歉，我现在无法回答这个问题。";
      return aiResponse;
    } catch (error) {
      console.error('AI响应错误:', error);
      return "抱歉，服务出现了问题，请稍后再试。";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (userInput.trim() && !isLoading) {
      setShowSuggestions(false);
      setShowWelcome(false);
      setChatHistory(prev => [...prev, { type: 'user', content: userInput }]);
      const currentMessage = userInput;
      setUserInput('');

      const aiResponse = await sendMessageToAI(currentMessage);
      setChatHistory(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }
  };

  const handleQuestionClick = async (question: string) => {
    if (!isLoading) {
      setShowSuggestions(false);
      setShowWelcome(false);
      setChatHistory(prev => [...prev, { type: 'user', content: question }]);

      const aiResponse = await sendMessageToAI(question);
      setChatHistory(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }
  };

  // 根据位置动态更新建议问题
  const getLocationBasedQuestions = () => {
    if (selectedLocation?.location) {
      return [
        `🗺️ ${selectedLocation.location}附近有什么景点？`,
        `🍲 ${selectedLocation.location}附近有什么特色美食？`,
        `📸 ${selectedLocation.location}有什么拍照打卡点？`,
        `🏛️ ${selectedLocation.location}的历史故事`,
        `🚶‍♂️ 从${selectedLocation.location}怎么去其他景点？`,
        `⏰ ${selectedLocation.location}的最佳游览时间`
      ];
    }
    return defaultQuestions;
  };

  return (
    <StyledChatSection>
      <StyledCard>
        <CardHeader>
          <span>AI 助手</span>
        </CardHeader>
        <CardBody>
          {showWelcome && <WelcomeMessage />}
          <ChatHistory chatHistory={chatHistory} />
          <ChatInput
            userInput={userInput}
            handleInputChange={handleInputChange}
            handleSend={handleSend}
            isLoading={isLoading}
          />
          {showSuggestions && (
            <SuggestedQuestions 
              onQuestionClick={handleQuestionClick}
              questions={getLocationBasedQuestions()}
            />
          )}
        </CardBody>
      </StyledCard>
    </StyledChatSection>
  );
};

// 添加 Markdown 样式组件
const MarkdownStyle = styled.div`
  padding: 8px;
  
  p {
    margin: 8px 0;
  }

  code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }

  pre {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
  }
`;

// 修改 ChatHistory 组件以支持 Markdown
const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => (
  <ChatHistoryContainer>
    {chatHistory.map((msg, index) => (
      <ChatMessage key={index} type={msg.type}>
        <MarkdownStyle>
          <ReactMarkdown
            children={msg.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                return (
                  <SyntaxHighlighter
                    style={dark}
                    language="javascript"
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }
            }}
          />
        </MarkdownStyle>
      </ChatMessage>
    ))}
  </ChatHistoryContainer>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ type, children }) => (
  <MessageContainer type={type}>
      {children}
  </MessageContainer>
);

// 修改 ChatInput 组件
const ChatInput: React.FC<ChatInputProps & { isLoading: boolean }> = ({
  userInput,
  handleInputChange,
  handleSend,
  isLoading
}) => (
  <InputContainer>
    <StyledTextArea
      value={userInput}
      onChange={handleInputChange}
      placeholder="您好！我是鼓浪屿AI助手，请告诉我您想了解些什么？例如：景点推荐、美食指南、交通攻略..."
      autoSize={{ minRows: 2, maxRows: 4 }}
      disabled={isLoading}
      onPressEnter={(e) => {
        if (!e.shiftKey && !isLoading) {
          e.preventDefault();
          handleSend();
        }
      }}
    />
    <SendButton
      type="primary"
      onClick={handleSend}
      loading={isLoading}
      disabled={isLoading}
      icon={<SendOutlined />}
    >
      发送
    </SendButton>
  </InputContainer>
);

// 更新 SuggestedQuestions 组件接口
interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  questions?: string[];
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  onQuestionClick, 
  questions = defaultQuestions 
}) => (
  <SuggestedQuestionsContainer>
    {questions.map((question, index) => (
      <StyledQuestionCard
        key={index}
        onClick={() => onQuestionClick(question)}
        hoverable
      >
        {question}
      </StyledQuestionCard>
    ))}
  </SuggestedQuestionsContainer>
);

export default ChatSection;