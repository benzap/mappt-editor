#Makefile for libmappt library

UNAME := $(shell uname)

TAGS_EXEC = etags

CXX = g++
CXXFLAGS = --std=c++0x

LDFLAGS = #-Wl,--verbose

LD_STATIC = -static-libgcc -static-libstdc++ #-static
LD_SHARED = -shared

BUILD = debug

#Production Build Versus Debug Build
ifeq ($(BUILD), production)
CXXFLAGS += -O2
else ifeq ($(BUILD), debug)
CXXFLAGS += -g
else
echo "Warning: Build Parameter is incorrect, using default debug build"
CXXFLAGS += -g
endif

ifeq ($(UNAME), Linux)
CXXFLAGS += -fPIC -DMAPPT_LINUX
else
CXXFLAGS += -mconsole -m32 -DMAPPT_WIN
endif

#directory where the output will be placed
OUTPUT_DIRECTORY = ../lib
#tests include
TESTS_DIRECTORY = ./tests

#global hpp files
GLOBAL_HPP= Mappt_Utils.hpp Mappt_Globals.hpp

#included directories considered for compiling
INCLUDED_DIRS = 

#get all of the .cpp files and .hpp files
HPP_FILES = $(wildcard *.hpp)
HPP_FILES += $(foreach dir,$(INCLUDED_DIRS),$(wildcard $(dir)/*.hpp))
CPP_FILES = $(wildcard *.cpp)
CPP_FILES += $(foreach dir,$(INCLUDED_DIRS),$(wildcard $(dir)/*.cpp))
OBJ_FILES = $(CPP_FILES:.cpp=.o)

LIBS = 
ifeq ($(UNAME), Linux)
LIBS += 
else
LIBS += 
endif

LIBS_DIR= -L. -L../lib -LC:\MinGW\lib

#redefine our suffixes
.SUFFIXES:
.SUFFIXES: .cpp .c .hpp .h

.PHONY: all clean mappt tests runtests tags
mappt: libmappt.a libmappt.so

all: clean mappt tests

%.o: %.cpp %.hpp $(GLOBAL_HPP)
	$(CXX) $(CXXFLAGS) -o $@ -c $< $(LIBS_DIR) $(LIBS) 

######### INCLUDED DIRECTORIES #############

#./collision/%.o: ./collision/%.cpp ./collision/%.hpp $(GLOBAL_HPP)
#	$(CXX) $(CXXFLAGS) -o $@ -c $< $(LIBS_DIR) $(LIBS)

#############################################


libmappt.a: $(OBJ_FILES)
	ar rcs $@ $(OBJ_FILES)
	cp $@ $(OUTPUT_DIRECTORY)/

libmappt.so: $(OBJ_FILES)
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $(LD_SHARED) -o $@ $(OBJ_FILES) $(LIBS_DIR) $(LIBS) 
	cp $@ $(OUTPUT_DIRECTORY)/
	cp $@ $(TESTS_DIRECTORY)/
runtests:
	make runtests -C $(TESTS_DIRECTORY)

tests: libmappt.a libmappt.so
	make -C $(TESTS_DIRECTORY)

clean:
	rm -f $(OBJ_FILES)
	rm -f libmappt.a
	rm -f libmappt.so
	rm -f $(OUTPUT_DIRECTORY)/libmappt.a
	rm -f $(OUTPUT_DIRECTORY)/libmappt.so
	rm -f $(TESTS_DIRECTORY)/libmappt.so
	make clean -C $(TESTS_DIRECTORY)

#generate TAGS file
tags:
	make -C $(TESTS_DIRECTORY) tags TAGS_EXEC=$(TAGS_EXEC)
	$(TAGS_EXEC) $(HPP_FILES) $(CPP_FILES) --include=$(TESTS_DIRECTORY)/TAGS

