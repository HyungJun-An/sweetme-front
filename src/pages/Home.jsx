import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RotateCcwIcon, SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Home = () => {
  const [date, setDate] = React.useState({
    from: new Date(2022, 0, 20),
    to: new Date(2022, 0, 20 + 20), // 20일 후 날짜를 설정
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 p-6 md:p-5">
      <section className="w-full max-w-4xl">
        <div className="w-full">
          <div className="w-full">
            <Button variant="ghost">전체</Button>
            <Button variant="ghost">모집중</Button>
            <Button variant="ghost">모집완료</Button>
          </div>
          <Separator />
          <form action="" className="my-10 flex w-full flex-col gap-2">
            <div className="relative flex gap-2">
              <SearchIcon className="absolute left-2 top-3 flex h-4 w-4" />
              <Input type="text" placeholder="스터디를 검색해보세요" className="pl-7" />
              <Button>검색</Button>
            </div>
            <Input type="text" placeholder="직무/스택을 검색해보세요" /> auto complete & 엔터로 태그 밑에 추가되도록
            <div className="flex gap-2">
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">온오프라인</Label>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <div className={cn('grid gap-2')}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(date.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              지역 , 직무, 스택 등
              <Button variant="outline">
                <RotateCcwIcon />
                초기화
              </Button>
            </div>
          </form>
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <div>
              <Button variant="ghost">최신순</Button>
              <Button variant="ghost">좋아요순</Button>
            </div>
            <Link to="/studies/new">
              <Button>글쓰기</Button>
            </Link>
          </div>
          <Separator />
          <ul className="my-10">
            <li>
              <Link to="/studies/1">
                <div className="border-b p-5">
                  <div className="flex">
                    <Badge>모집중</Badge>
                    <h3>제목</h3>
                  </div>
                  <div>내용</div>
                  <div>작성자, 시간, 조회수, 좋아요 등</div>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
};
export default Home;
