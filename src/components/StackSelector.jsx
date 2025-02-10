// StackSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const StackSelector = ({ options, selectedStacks, onStackToggle, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedStacks, setDisplayedStacks] = useState([]);
  const [page, setPage] = useState(1);
  const [filteredStacks, setFilteredStacks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const observerTarget = useRef(null);

  // 초기 데이터 설정
  useEffect(() => {
    if (!options.stacks) return;

    const initialStacks = options.stacks;
    setFilteredStacks(initialStacks);
    setDisplayedStacks(initialStacks.slice(0, ITEMS_PER_PAGE));
    setPage(1);
  }, [options.stacks]);

  // 검색어에 따라 스택 필터링
  useEffect(() => {
    if (!options.stacks) return;

    if (searchTerm === '') {
      // 검색어가 없으면 전체 스택 표시
      setFilteredStacks(options.stacks);
    } else {
      // 검색어가 있으면 필터링된 결과 표시
      const filtered = options.stacks.filter((stack) => stack.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredStacks(filtered);
    }
  }, [searchTerm, options.stacks]);

  // filteredStacks 가 바뀔 때 displayedStacks 초기화
  useEffect(() => {
    setDisplayedStacks(filteredStacks.slice(0, ITEMS_PER_PAGE));
    setPage(1);
  }, [filteredStacks]);

  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedStacks.length < filteredStacks.length) {
          const nextPage = page + 1;
          const start = (nextPage - 1) * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;

          setDisplayedStacks((prev) => [...prev, ...filteredStacks.slice(start, end)]);
          setPage(nextPage);
        }
      },
      { threshold: 0.1, root: null, rootMargin: '0px' },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayedStacks.length, filteredStacks, page]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 선택된 스택들 표시
  const SelectedStacks = () => (
    <div className="flex flex-wrap gap-2">
      {selectedStacks.map((stack) => (
        <Button
          key={stack.id}
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onStackToggle(stack.id)}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={stack.logoURL} alt={stack.name} />
            <AvatarFallback>{stack.name[0]}</AvatarFallback>
          </Avatar>
          <span>{stack.name}</span>
        </Button>
      ))}
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          + 스택 추가
        </Button>
      </DialogTrigger>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <SelectedStacks />
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>기술 스택 선택</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="스택 검색..." value={searchTerm} onChange={handleSearch} className="pl-8" />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <div className="w-full p-4 text-center text-muted-foreground">
                <span>데이터를 불러오는 중...</span>
              </div>
            ) : (
              displayedStacks.map((stack) => (
                <Button
                  key={stack.id}
                  type="button"
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    selectedStacks.some((s) => s.id === stack.id) ? 'opacity-100' : 'opacity-50'
                  }`}
                  onClick={() => onStackToggle(stack.id)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={stack.logoURL} alt={stack.name} />
                    <AvatarFallback>{stack.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{stack.name}</span>
                </Button>
              ))
            )}
            <div ref={observerTarget} className="h-4 w-full" />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StackSelector;
