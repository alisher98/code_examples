select
       project, constructive,
       under_constructive, work_group,
       block, floor, level,
       MIN(base_plan_start_date) as min_base_plan_start_date,
       max(base_plan_finish_date) as max_base_plan_finish_date,
       ARRAY_AGG(
               JSONB_BUILD_OBJECT('plan_value', plan_value, 'contractor', contractor)
                   ORDER BY contractor IS NULL, plan_value DESC
       ) AS contractors
from table_first_task
group by project, constructive, under_constructive, work_group, block, floor, level
order by project ASC