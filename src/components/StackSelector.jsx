import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 20; // 한 번에 로드할 아이템 수

const StackSelector = ({ options, selectedStacks, onStackToggle, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStacks, setFilteredStacks] = useState([]);
  const [displayedStacks, setDisplayedStacks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 초기 데이터 설정
  useEffect(() => {
    if (!options.stacks) return;
    const filtered = filterStacks(options.stacks, searchTerm);
    setFilteredStacks(filtered);
    setDisplayedStacks(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [options.stacks, searchTerm]);

  // 스택 필터링 함수
  const filterStacks = (stacks, term) => {
    return term === '' ? stacks : stacks.filter((stack) => stack.name.toLowerCase().includes(term.toLowerCase()));
  };

  const lastStackElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          const start = (nextPage - 1) * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;

          setDisplayedStacks((prev) => [...prev, ...filteredStacks.slice(start, end)]);
          setPage(nextPage);
          setHasMore(filteredStacks.length > end);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, filteredStacks],
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
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
          <DialogDescription>
            사용하시는 기술 스택을 선택해주세요. 검색을 통해 원하는 스택을 찾을 수 있습니다.
          </DialogDescription>
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
              displayedStacks.map((stack, index) => (
                <Button
                  key={stack.id}
                  ref={index === displayedStacks.length - 1 ? lastStackElementRef : null}
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
            {!isLoading && hasMore && (
              <div className="w-full p-4 text-center text-muted-foreground">
                <span>더 많은 스택 불러오는 중...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StackSelector;
