import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ReactQuillEditor from '@/components/ReactQuillEditor';

// zod를 이용한 폼 검증 스키마 정의
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  desc: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
});

const StudyNew = () => {
  // 1. React Hook Form을 사용해 폼 설정
  const form = useForm({
    resolver: zodResolver(formSchema), // Zod 검증 스키마 React Hook Form에 연결
    defaultValues: {
      title: '', // 폼의 초기값 설정
      desc: '', // description을 위한 초기값 설정
    },
  });

  // 2. 폼 제출 시 호출되는 함수 (API 호출 등)
  function onSubmit(values) {
    // zod 유효성 검증 완료 후 함수 호출
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 제목 입력 필드 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="제목" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 설명 입력 필드: ReactQuill 사용 */}
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {/* Controller로 ReactQuill을 감싸서 react-hook-form과 통합 */}
                <Controller
                  control={form.control}
                  name="desc"
                  render={({ field: { onChange, value } }) => (
                    <ReactQuillEditor
                      value={value}
                      onChange={onChange} // onChange 처리
                      placeholder="내용을 입력하세요"
                      {...field}
                    />
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 제출 버튼 */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StudyNew;
