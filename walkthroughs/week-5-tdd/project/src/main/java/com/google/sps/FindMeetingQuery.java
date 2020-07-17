// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Collection;
import java.util.Comparator;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {


    long mrd = request.getDuration();
    //--------------pt 1: Filter out all the times when ppl are in events during request times
    List<TimeRange> step1 = new ArrayList<TimeRange>();
    // List<TimeRange> prob_optional = new ArrayList<TimeRange>;
    // List<TimeRange> prob_definite = new ArrayList<TimeRange>;
    int day = TimeRange.END_OF_DAY - TimeRange.START_OF_DAY;
    if (mrd < day) {
        for (Event cur_event : events) { 
            for (String person : request.getAttendees()) { 
                if (cur_event.getAttendees().contains(person)) {
                    step1.add(cur_event.getWhen());
                }
            }

        }
    } else {
        return step1;
    }



    //--------------pt 2: Find all events that overlap and happen in same time frame
    List<TimeRange> step2 = new ArrayList<TimeRange>();
    int counter1 = 0;
    for(TimeRange event1 : step1) {
        int counter2 = 0;
        int testpassed = 0;
        for(TimeRange event2 : step1) {
            if(counter1 != counter2) {
                if (event2.contains(event1) == false) 
                    testpassed++;
                }
            }
            counter2++;
        }
        if(testpassed == (events.size() - 1)) { 
            step2.add(event1);
        }
        counter1++; 
    }
    
    Collections.sort(step2,TimeRange.ORDER_BY_START);



    //--------------pt 3: Use all busy times to create all free times 
    List<TimeRange> results = new ArrayList<TimeRange>();
    int diff = 0;
    if (step2.size() != 0 ) {
        for(int i = 0; i < step2.size(); i++) {
            if (i == 0 ) { 
                diff = step2.get(i).start() - TimeRange.START_OF_DAY;
                if ((long)diff >= mrd){
                    results.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY,step2.get(i).start(),false));
                }
            }
            if (0 < i ) {
                diff = step2.get(i).start() - step2.get(i-1).end();
                if ((long)diff >= mrd) {
                    results.add(TimeRange.fromStartEnd(step2.get(i-1).end(),step2.get(i).start(),false));
                }
            }
        }
        diff = TimeRange.END_OF_DAY - step2.get(step2.size()-1).end();
        if ((long)diff >= mrd){
                    results.add(TimeRange.fromStartEnd(step2.get(step2.size()-1).end(),TimeRange.END_OF_DAY,true));
        } 
    } else {
        results.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY,TimeRange.END_OF_DAY,true));
    }
    return results;
  }
}

